export default function customEmail({ body }) {
  return `
    <div style="
      font-family: Arial, sans-serif;
      font-size: 15px;
      color: #222;
      line-height: 1.7;
      max-width: 600px;
      margin: auto;
      padding: 24px;
    ">
      ${body}
    </div>
  `;
}
