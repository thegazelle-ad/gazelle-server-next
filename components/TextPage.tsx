interface TextPageInterface {
  title: string;
  html: string;
}

const TextPage = (props: TextPageInterface) => {
  return (
    <div className="text-page">
      <h2 className="text-page__title">{props.title}</h2>
      <div
        className="text-page__html"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: props.html }}
      />
    </div>
  );
}

export default TextPage;
