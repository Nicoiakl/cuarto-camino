export type PracticeKind = 'remember' | 'observe' | 'stop' | 'aim';

export type PracticeStep = {
  breath?: boolean;
  titleKey: string;
  bodyKey: string;
  durationSec: number;
};

export type DailyPractice = {
  kind: PracticeKind;
  minutes: number;
  steps: PracticeStep[];
};

const PRACTICES: DailyPractice[] = [
  {
    kind: 'remember',
    minutes: 8,
    steps: [
      { titleKey: 'practice.steps.arriveTitle', bodyKey: 'practice.steps.arriveBody', durationSec: 40, breath: true },
      { titleKey: 'practice.steps.divideTitle', bodyKey: 'practice.steps.divideBody', durationSec: 70 },
      { titleKey: 'practice.steps.holdTitle', bodyKey: 'practice.steps.holdBody', durationSec: 80 },
      { titleKey: 'practice.steps.returnTitle', bodyKey: 'practice.steps.returnBody', durationSec: 50 },
    ],
  },
  {
    kind: 'observe',
    minutes: 9,
    steps: [
      { titleKey: 'practice.steps.arriveTitle', bodyKey: 'practice.steps.arriveBody', durationSec: 35, breath: true },
      { titleKey: 'practice.steps.scanTitle', bodyKey: 'practice.steps.scanBody', durationSec: 75 },
      { titleKey: 'practice.steps.centerTitle', bodyKey: 'practice.steps.centerBody', durationSec: 75 },
      { titleKey: 'practice.steps.nameITitle', bodyKey: 'practice.steps.nameIBody', durationSec: 55 },
    ],
  },
  {
    kind: 'stop',
    minutes: 7,
    steps: [
      { titleKey: 'practice.steps.arriveTitle', bodyKey: 'practice.steps.arriveBody', durationSec: 30, breath: true },
      { titleKey: 'practice.steps.freezeTitle', bodyKey: 'practice.steps.freezeBody', durationSec: 60 },
      { titleKey: 'practice.steps.whoTitle', bodyKey: 'practice.steps.whoBody', durationSec: 70 },
      { titleKey: 'practice.steps.releaseTitle', bodyKey: 'practice.steps.releaseBody', durationSec: 45 },
    ],
  },
  {
    kind: 'aim',
    minutes: 8,
    steps: [
      { titleKey: 'practice.steps.arriveTitle', bodyKey: 'practice.steps.arriveBody', durationSec: 35, breath: true },
      { titleKey: 'practice.steps.aimSeeTitle', bodyKey: 'practice.steps.aimSeeBody', durationSec: 70 },
      { titleKey: 'practice.steps.aimMomentTitle', bodyKey: 'practice.steps.aimMomentBody', durationSec: 75 },
      { titleKey: 'practice.steps.aimSealTitle', bodyKey: 'practice.steps.aimSealBody', durationSec: 50 },
    ],
  },
];

export function practiceOfDay(date = new Date()): DailyPractice {
  const day = Math.floor(date.getTime() / 86_400_000);
  return PRACTICES[day % PRACTICES.length];
}
