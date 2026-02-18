export const UserSession = {
  isGuest(): boolean {
    return localStorage.getItem("logic_looper_guest") === "1";
  },

  startGuest(): void {
    localStorage.setItem("logic_looper_guest", "1");
  },

  clear(): void {
    localStorage.removeItem("logic_looper_guest");
  },

  key(base: string): string {
    // Separate data per account or guest
    if (this.isGuest()) return "guest_" + base;
    return base;
  },
};
