import { UserSession } from "./userSession";

export type Achievement = {
  id: string;
  title: string;
  description: string;
};

const ACH_KEY = "logic_looper_achievements";

function key() {
  return UserSession.key(ACH_KEY);
}

export const Achievements = {

  getUnlocked(): string[] {
    const raw = localStorage.getItem(key());
    return raw ? JSON.parse(raw) : [];
  },

  unlock(id: string): boolean {
    const list = this.getUnlocked();

    if (list.includes(id)) return false;

    list.push(id);
    localStorage.setItem(key(), JSON.stringify(list));
    return true;
  }

};
