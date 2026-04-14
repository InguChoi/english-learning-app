import { ExampleType } from "@prisma/client";
import { getOpenAIClient } from "@/lib/openai";

const SYSTEM_PROMPT = `You create compact English-learning data for a single vocabulary word.
Respond only as valid JSON in this exact shape:
{
  "koreanMeaning": "...",
  "englishDefinition": "...",
  "examples": [
    { "type": "simple", "sentence": "...", "koreanTranslation": "..." },
    { "type": "practical", "sentence": "...", "koreanTranslation": "..." },
    { "type": "conversational", "sentence": "...", "koreanTranslation": "..." }
  ]
}
Rules:
- koreanMeaning must be a natural Korean translation or explanation.
- englishDefinition must be a short learner-friendly English definition.
- examples must contain exactly 3 items.
- Sentences must sound natural and clearly use the target word.
- koreanTranslation must translate each sentence naturally into Korean.
- Do not include markdown.`;

type RawExampleType = "simple" | "practical" | "conversational";

type LearningPackResponse = {
  koreanMeaning?: string;
  englishDefinition?: string;
  examples?: Array<{
    type?: RawExampleType | string;
    sentence?: string;
    koreanTranslation?: string;
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

export async function generateLearningPack(word: string) {
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
        content: `Target word: "${word}"`
      }
    ]
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("The AI response was empty.");
  }

  const parsed = JSON.parse(content) as LearningPackResponse;
  const koreanMeaning = parsed.koreanMeaning?.trim();
  const englishDefinition = parsed.englishDefinition?.trim();

  const examples = parsed.examples?.map((example) => {
    const type = example.type ? toExampleType(example.type) : null;
    const sentence = example.sentence?.trim();
    const koreanTranslation = example.koreanTranslation?.trim();

    if (!type || !sentence || !koreanTranslation) {
      return null;
    }

    return {
      type,
      sentence,
      koreanTranslation
    };
  });

  if (
    !koreanMeaning ||
    !englishDefinition ||
    !examples ||
    examples.length !== 3 ||
    examples.some((example) => example === null)
  ) {
    throw new Error("The AI response was not in the expected format.");
  }

  return {
    koreanMeaning,
    englishDefinition,
    examples: examples.filter(
      (
        example
      ): example is {
        type: ExampleType;
        sentence: string;
        koreanTranslation: string;
      } => example !== null
    )
  };
}
