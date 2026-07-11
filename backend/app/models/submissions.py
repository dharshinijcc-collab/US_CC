from backend.app.db import DBHelper

class SubmissionModel:
    @staticmethod
    def save_idea(name: str, email: str, idea: str) -> int:
        """Saves a startup idea submission into the database.

        Args:
            name: Submitter's name.
            email: Submitter's email.
            idea: Brief of the startup idea.

        Returns:
            The created submission ID.
        """
        return DBHelper.insert(
            "idea_submissions",
            return_column="id",
            name=name,
            email=email,
            idea=idea
        )

    @staticmethod
    def save_talent(full_name: str, email: str, interest_area: str, linkedin_url: str, resume_url: str = None) -> int:
        """Saves a talent application into the database.

        Args:
            full_name: Applicant's name.
            email: Applicant's email.
            interest_area: Preferred department/role.
            linkedin_url: Link to LinkedIn profile.
            resume_url: URL to uploaded resume file.

        Returns:
            The created talent pool ID.
        """
        insert_kwargs = dict(
            full_name=full_name,
            email=email,
            interest_area=interest_area,
            linkedin_url=linkedin_url
        )
        if resume_url:
            insert_kwargs["resume_url"] = resume_url
        return DBHelper.insert("talent_pool", return_column="id", **insert_kwargs)

    @staticmethod
    def save_contact(full_name: str, work_email: str, company_name: str, service_interest: str, project_stage: str, message: str) -> int:
        """Saves a contact/inquiry form submission into the database.

        Args:
            full_name: Submitter's name.
            work_email: Business email.
            company_name: Organization name.
            service_interest: Specific services requested.
            project_stage: Current state of production.
            message: Form text payload.

        Returns:
            The created inquiry ID.
        """
        return DBHelper.insert(
            "contact_inquiries",
            return_column="id",
            full_name=full_name,
            work_email=work_email,
            company_name=company_name,
            service_interest=service_interest,
            project_stage=project_stage,
            message=message
        )

    @staticmethod
    def save_investor(full_name: str, email: str, expertise: str, preferred_roles: list[str], background: str) -> int:
        """Saves an investor profile submission into the database.

        Args:
            full_name: Investor's name.
            email: Contact email.
            expertise: Focus sectors.
            preferred_roles: Advisory roles interested in.
            background: History detail.

        Returns:
            The created investor submission ID.
        """
        return DBHelper.insert(
            "investor_submissions",
            return_column="id",
            full_name=full_name,
            email=email,
            expertise=expertise,
            preferred_roles=preferred_roles,
            background=background
        )
