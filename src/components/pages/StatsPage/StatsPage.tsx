import PageWrapper from "../PageWrapper/PageWrapper";
import ProjectsProgressChart from "./ProjectsProgressChart";

const ProfilePage = (): JSX.Element => {
  return (
    <PageWrapper goBack title="Statistics">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 15,
        }}
      >
        <ProjectsProgressChart />
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
