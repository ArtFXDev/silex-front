import PageWrapper from "../PageWrapper/PageWrapper";

const TicketPage = (): JSX.Element => {
  return (
    <PageWrapper title="Ticket" goBack fullHeight>
      <iframe
        title="Ticket"
        width="100%"
        height="100%"
        src={process.env.REACT_APP_TICKET_URL}
      ></iframe>
    </PageWrapper>
  );
};

export default TicketPage;
