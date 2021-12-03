import PageWrapper from "../PageWrapper/PageWrapper";

const TractorPage = (): JSX.Element => {
  return (
    <PageWrapper title="Tractor" goBack fullHeight>
      <iframe
        title="Tractor"
        width="100%"
        height="100%"
        src="http://tractor"
      ></iframe>
    </PageWrapper>
  );
};

export default TractorPage;
