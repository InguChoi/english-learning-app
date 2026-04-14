import { ExampleType } from "@prisma/client";
import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { isNonEmptyString } from "@/lib/validators";

const SYSTEM_PROMPT =
  'You generate exactly three English example sentences for vocabulary study. Respond only as valid JSON with this shape: {"examples":[{"type":"simple","sentence":"..."},{"type":"practical","sentence":"..."},{"type":"conversational","sentence":"..."}]}. Keep sentences natural, concise, and clearly different from one another.';

type RequestBody = {
  word?: unknown;
  wordId?: unknown;
};

type ExampleResponse = {
  examples?: Array<{
    type?: string;
    sentence?: string;
  }>;
};

function toExampleType(value: string) {
  switch (value.toLowerCase()) {
    case "simple":
      return ExampleType.SIMPLE;
    case "practical":
    case "technical":
      return ExampleType.PRACTICAL;
    case "conversational":
      return ExampleType.CONVERSATIONAL;
    default:
      return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const word = isNonEmptyString(body.word) ? body.word.trim() : "";
    const wordId = typeof body.wordId === "number" ? body.wordId : Number(body.wordId);

    if (!word || !Number.isInteger(wordId)) {
      return NextResponse.json({ error: "word and wordId are required." }, { status: 400 });
    }

    const existingWord = await prisma.word.findUnique({
      where: { id: wordId }
    });

    if (!existingWord) {
      return NextResponse.json({ error: "Word not found." }, { status: 404 });
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      response_format: {
        type: "json_object"
      },
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Generate three example sentences for the word "${word}".`
        }
      ]
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "The AI response was empty. Please try again." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(content) as ExampleResponse;
    const examples = parsed.examples?.map((item) => {
      const type = item.type ? toExampleType(item.type) : null;
      const sentence = typeof item.sentence === "string" ? item.sentence.trim() : "";

      if (!type || !sentence) {
        return null;
      }

      return {
        type,
        sentence,
        wordId
      };
    });

    if (!examples || examples.length !== 3 || examples.some((item) => item === null)) {
      return NextResponse.json(
        { error: "The AI response was not in the expected format." },
        { status: 502 }
      );
    }

    const validExamples = examples.filter(
      (item): item is { wordId: number; sentence: string; type: ExampleType } => item !== null
    );

    await prisma.$transaction([
      prisma.example.deleteMany({
        where: { wordId }
      }),
      prisma.example.createMany({
        data: validExamples
      })
    ]);

    const savedExamples = await prisma.example.findMany({
      where: { wordId },
      orderBy: {
        createdAt: "asc"
      }
    });

    return NextResponse.json({ examples: savedExamples });
  } catch (error) {
    console.error("Failed to generate examples", error);
    return NextResponse.json(
      { error: "Failed to generate example sentences." },
      { status: 500 }
    );
  }
}
