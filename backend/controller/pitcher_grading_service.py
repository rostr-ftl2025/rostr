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

        # -------------------------
        # STRIKEOUT PERSONALITY
        # -------------------------
        if k >= 32:
            lines.append(f"• Carries your strikeout category with elite swing-and-miss skill ({k:.1f}% K rate).")
        elif k >= 28:
            lines.append(f"• Provides strong strikeout output ({k:.1f}% K rate) and reliably boosts weekly totals.")
        elif k >= 24:
            lines.append(f"• Offers steady strikeout support ({k:.1f}% K rate) without being overpowering.")
        elif k >= 20:
            lines.append(f"• Strikeout production is modest ({k:.1f}% K rate), so pairing him with a high-K arm is beneficial.")
        else:
            lines.append(f"• Low strikeout output ({k:.1f}% K rate) limits his fantasy ceiling.")

        # -------------------------
        # INNINGS PERSONALITY
        # -------------------------
        if ip >= 170:
            lines.append(f"• High-volume workload ({ip:.1f} IP) provides stability and contributes across all counting stats.")
        elif ip >= 130:
            lines.append(f"• Moderate workload ({ip:.1f} IP) gives reliable usage without heavy innings demand.")
        else:
            lines.append(f"• Light innings load ({ip:.1f} IP) lowers his week-to-week fantasy impact.")

        # -------------------------
        # ERA PERSONALITY
        # -------------------------
        if era <= 2.50:
            lines.append(f"• Limits damage exceptionally well (ERA {era:.2f}), anchoring team ratios.")
        elif era <= 3.50:
            lines.append(f"• Manages contact effectively (ERA {era:.2f}), generally providing stable ratios.")
        elif era <= 4.25:
            lines.append(f"• Inconsistent run prevention (ERA {era:.2f}), making matchup selection important.")
        else:
            lines.append(f"• High risk to ERA and WHIP (ERA {era:.2f}), requiring careful matchup management.")

        # -------------------------
        # COMBINATION LOGIC
        # -------------------------
        profile = None
        recommendation = None

        # Ace Workhorse
        if k >= 28 and ip >= 170 and era <= 3.00:
            profile = "Ace Workhorse"
            recommendation = "Start every week without hesitation."

        # Strikeout Specialist (high K, low IP)
        elif k >= 30 and ip < 130:
            profile = "Strikeout Specialist"
            recommendation = "Great for boosting Ks, but may need innings support."

        # Ratio Specialist (low ERA, low K)
        elif k < 22 and era < 3.25:
            profile = "Ratio Protector"
            recommendation = "Strong ratios but limited upside in strikeouts."

        # Volatile Strikeout Arm (high K, high ERA)
        elif k >= 28 and era >= 4.00:
            profile = "Volatile Strikeout Arm"
            recommendation = "Useful for Ks but may hurt your ratios; stream based on matchups."

        # Contact Manager (low K, low ERA)
        elif k < 20 and era < 3.50:
            profile = "Contact Manager"
            recommendation = "Low strikeouts but provides solid ratio stability."

        # Volume-Only Arm (high IP, bad ERA)
        elif ip >= 160 and era >= 4.30:
            profile = "High-Volume Ratio Risk"
            recommendation = "Provides innings but is likely harmful in ERA/WHIP."

        # Neutral default
        else:
            profile = "Balanced Profile"
            recommendation = "Contributes steadily without major strengths or weaknesses."


        # Summary
        summary = (
            f"{tier} Tier:\n"
            + "\n".join(lines)
            + f"\nFantasy Recommendation: {recommendation}"
        )

        return summary