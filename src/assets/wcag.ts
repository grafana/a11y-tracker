import wcagJson from 'assets/wcag.json';

export const wcag = wcagJson as WCAGPrinciple[];

export interface WCAGPrinciple {
  ref_id: string;
  title: string;
  description: string;
  url: string;
  guidelines: Guideline[];
}

// Guideline represents a single guideline under a WCAG item.
export interface Guideline {
  ref_id: string;
  title: string;
  description: string;
  url: string;
  references: Reference[];
  success_criteria: SuccessCriterion[];
}

export interface SuccessCriterion {
  ref_id: string;
  title: string;
  description: string;
  url: string;
  level: WCAGLevel;
  special_cases: SpecialCase[] | null;
  notes: Note[];
  references: Reference[];
}

export type WCAGLevel = `A` | `AA` | `AAA`;

export interface SpecialCase {
  title: string;
  description: string;
  type: `all_true` | `at_least_one` | `exception`;
}

export interface Note {
  content: string;
}

export interface Reference {
  title: string;
  url: string;
}

export function getSuccessCriterionByRefId(refId: string) {
  const [principleRef, guidelineRef, scRef] = refId.split(`.`);

  return wcag[Number(principleRef) - 1].guidelines[Number(guidelineRef) - 1].success_criteria[Number(scRef) - 1];
}
