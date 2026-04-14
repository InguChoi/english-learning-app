import { NextResponse } from "next/server";
import { generateLearningPack } from "@/lib/learning-pack";
import { prisma } from "@/lib/prisma";
import { isNonEmptyString } from "@/lib/validators";

type RequestBody = {
  word?: unknown;
  wordId?: unknown;
};

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

    const learningPack = await generateLearningPack(word);

    await prisma.$transaction([
      prisma.word.update({
        where: { id: wordId },
        data: {
          meaning: learningPack.koreanMeaning,
          koreanMeaning: learningPack.koreanMeaning,
          englishDefinition: learningPack.englishDefinition
        }
      }),
      prisma.example.deleteMany({
        where: { wordId }
      }),
      prisma.example.createMany({
        data: learningPack.examples.map((example) => ({
          wordId,
          sentence: example.sentence,
          koreanTranslation: example.koreanTranslation,
          type: example.type
        }))
      })
    ]);

    const refreshedWord = await prisma.word.findUnique({
      where: { id: wordId },
      include: {
        examples: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    });

    return NextResponse.json(refreshedWord);
  } catch (error) {
    console.error("Failed to generate examples", error);
    return NextResponse.json(
      { error: "Failed to generate learning content." },
      { status: 500 }
    );
  }
}
