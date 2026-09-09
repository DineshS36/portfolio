export default function MaskedTitle({ number, text, className = 'section-title uppercase' }) {
  const words = text ? text.trim().split(/\s+/) : [];

  return (
    <h2 className={`masked-heading ${className}`}>
      {number && (
        <span className="word-mask">
          <span className="word-inner text-dark-gray">{number}</span>
        </span>
      )}
      {words.map((word, i) => (
        <span key={i} className="word-mask">
          <span className="word-inner">{word}</span>
        </span>
      ))}
    </h2>
  );
}
