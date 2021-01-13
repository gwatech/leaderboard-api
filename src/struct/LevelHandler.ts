class Level {
    private static getLevelExp(level: number): number {
        return 5 * Math.pow(level, 2) + 50 * level + 100;
    }

    public getLevelFromExp(exp: number): number {
        let level = 0;

        while (exp >= Level.getLevelExp(level)) {
            exp -= Level.getLevelExp(level);
            level++;
        }

        return level;
    }
}

export const { getLevelFromExp } = new Level();