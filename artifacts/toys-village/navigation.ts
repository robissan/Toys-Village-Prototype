import { router } from 'expo-router';
import type { GameId } from '@/game/session';

export function gameHref(game: GameId): '/play/time' | '/play/color' {
  return game === 'time' ? '/play/time' : '/play/color';
}

export function openGrownUp(from: 'home' | 'play') {
  router.push({ pathname: '/grown-up', params: { from } });
}

export function openGame(game: GameId) {
  const href = gameHref(game);
  if (router.canDismiss()) {
    router.dismissAll();
    setTimeout(() => router.push(href), 0);
    return;
  }
  router.push(href);
}

export function resumeGame(game: GameId, fromPlay: boolean) {
  if (fromPlay && router.canGoBack()) {
    router.back();
    return;
  }
  router.push(gameHref(game));
}

export function leaveToVillage() {
  if (router.canDismiss()) router.dismissAll();
  else router.replace('/');
}
