import { ExampleType } from "@prisma/client";

export function formatExampleType(type: ExampleType) {
  switch (type) {
    case ExampleType.SIMPLE:
      return "Simple";
    case ExampleType.PRACTICAL:
      return "Practical";
    case ExampleType.CONVERSATIONAL:
      return "Conversational";
    default:
      return type;
  }
}
