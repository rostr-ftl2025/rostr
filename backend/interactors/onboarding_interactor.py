from dataclasses import dataclass

@dataclass
class OnboardingRequest:
    user_id: str


@dataclass
class OnboardingResponse:
    steps_completed: int
    next_step: str


class OnboardingInteractor:
    """Use case: Help new users quickly learn the app and navigate between pages."""

    def handle(self, request: OnboardingRequest) -> OnboardingResponse:
        if not request.user_id:
            raise ValueError("user_id is required")

        return OnboardingResponse(
            steps_completed=1,
            next_step="open_home_page"
        )
