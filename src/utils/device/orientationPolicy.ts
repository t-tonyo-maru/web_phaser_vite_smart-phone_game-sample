type OrientationLock =
  | 'any'
  | 'natural'
  | 'landscape'
  | 'portrait'
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape-primary'
  | 'landscape-secondary';

type OrientationMode = 'portrait' | 'landscape';

const detectOrientation = (): OrientationMode => {
  return window.matchMedia('(orientation: portrait)').matches
    ? 'portrait'
    : 'landscape';
};

const updateOrientationDataset = (): void => {
  document.documentElement.dataset.orientation = detectOrientation();
};

const tryLockPortrait = async (): Promise<void> => {
  if (!('orientation' in screen)) return;

  const orientationApi = screen.orientation as ScreenOrientation & {
    lock?: (orientation: OrientationLock) => Promise<void>;
  };

  if (typeof orientationApi.lock !== 'function') return;

  try {
    await orientationApi.lock('portrait');
    document.documentElement.dataset.orientationLock = 'portrait';
  } catch {
    document.documentElement.dataset.orientationLock = 'unavailable';
  }
};

/**
 * モバイル向けの画面向きポリシー。
 * 初回操作時に縦向き固定を試行し、常に現在向きをデータ属性に保持する。
 */
export const setupPortraitOrientationPolicy = (): void => {
  updateOrientationDataset();

  window.addEventListener('resize', updateOrientationDataset);
  window.addEventListener('orientationchange', updateOrientationDataset);

  const onFirstGesture = (): void => {
    void tryLockPortrait();
  };

  window.addEventListener('pointerdown', onFirstGesture, { once: true });
};
