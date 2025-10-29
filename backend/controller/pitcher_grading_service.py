class PitcherGradingService:
    @staticmethod
    def calculate_pitcher_grade(stats: dict) -> float:
        """
        Calculate a pitcher's grade using the fantasy formula:
        Grade = 150 × K% + 0.3 × IP − 10 × ERA
        Weights based on typical fantasy baseball head-to-head (H2H) scoring systems, which reward 
        strikeouts (K%) heavily, innings pitched (IP) moderately, and punish high ERA significantly
        """
        try:
            k_percent = stats.get("K%")
            ip = stats.get("IP")
            era = stats.get("ERA")

            if k_percent is None or ip is None or era is None:
                raise ValueError("Missing required pitching stats.")

            grade = 150 * k_percent + 0.3 * ip - 10 * era
            return round(grade, 2)

        except Exception as e:
            print(f"Error calculating pitcher grade: {e}")
            return 0.0