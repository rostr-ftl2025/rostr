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
        
    @staticmethod
    def analyze_pitcher(stats: dict, grade: float) -> str:
        k = stats.get("K%")*100
        ip = stats.get("IP")
        era = stats.get("ERA")

        # Determine tier
        if grade >= 80:
            tier = "Elite"
        elif grade >= 70:
            tier = "Top"
        elif grade >= 60:
            tier = "Solid"
        elif grade >= 45:
            tier = "Replacement"
        else:
            tier = "Poor"

        # Build natural-language analysis lines
        lines = []

        # K%
        if k >= 30:
            lines.append(f"Very strong strikeout rate ({k} K%).")
        elif k >= 25:
            lines.append(f"Strong strikeout production ({k} K%).")
        elif k >= 20:
            lines.append(f"Average strikeout production ({k} K%).")
        else:
            lines.append(f"Below-average strikeout ability ({k} K%).")

        # IP
        if ip >= 150:
            lines.append(f"High workload and strong durability ({ip} IP).")
        elif ip >= 100:
            lines.append(f"Moderate innings volume ({ip} IP).")
        else:
            lines.append(f"Low workload ({ip} IP), may have limited weekly impact.")

        # ERA
        if era <= 3:
            lines.append(f"Excellent run prevention (ERA {era}).")
        elif era <= 4:
            lines.append(f"Decent ERA ({era}), not elite but serviceable.")
        else:
            lines.append(f"Poor ERA ({era}), risky for ratios.")

        # Summary
        summary = (
            f"{tier} Tier:\n"
            + "\n".join(lines)
        )

        return summary