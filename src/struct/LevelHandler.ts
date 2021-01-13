class LevelHandlder {

	public getLevelExp(level: number): number {
		return 5 * Math.pow(level, 2) + 50 * level + 100;
	}

	public getLevelFromExp(exp: number): number {
		let level = 0;

		while (exp >= this.getLevelExp(level)) {
			exp -= this.getLevelExp(level);
			level++;
		}

		return level;
	}

	public getLevelProgress(exp: number): number {
		let level = 0;

		while (exp >= this.getLevelExp(level)) {
			exp -= this.getLevelExp(level);
			level++;
		}

		return exp;
	}
}

export const { getLevelExp } = new LevelHandlder();