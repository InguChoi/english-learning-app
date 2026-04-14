import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;
  const wordId = Number(id);

  if (!Number.isInteger(wordId)) {
    return NextResponse.json({ error: "Invalid word id." }, { status: 400 });
  }

  try {
    const word = await prisma.word.findUnique({
      where: { id: wordId },
      include: {
        examples: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    });

    if (!word) {
      return NextResponse.json({ error: "Word not found." }, { status: 404 });
    }

    return NextResponse.json(word);
  } catch (error) {
    console.error("Failed to fetch word", error);
    return NextResponse.json({ error: "Failed to fetch word." }, { status: 500 });
  }
}
