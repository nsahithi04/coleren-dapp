const newUserInvite = ({ inviteLink, inviterName }) => {
  return `
    <div style="font-family: sans-serif; padding: 32px;">
      <h1>You've been invited to join a team</h1>

      <p>
        ${inviterName} invited you to join their team on Coleren.
      </p>

      <p>
        Create your account to get started.
      </p>

      <a
        href="${inviteLink}"
        style="
          display: inline-block;
          padding: 14px 24px;
          background: #24BC61;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin-top: 20px;
        "
      >
        Sign Up & Join
      </a>
    </div>
  `;
};

export default newUserInvite;
