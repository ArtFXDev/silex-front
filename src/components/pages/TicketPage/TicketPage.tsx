import PageWrapper from "../PageWrapper/PageWrapper";

const TicketPage = (): JSX.Element => {
  return (
    <PageWrapper title="Ticket" goBack fullHeight>
      <webview
        src={import.meta.env.VITE_TICKET_URL}
        style={{ width: "100%", height: "100%" }}
      ></webview>
    </PageWrapper>
  );
};

export default TicketPage;
