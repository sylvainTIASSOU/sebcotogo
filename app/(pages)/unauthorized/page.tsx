export default function Unauthorized() {
        return (
          <div className="flex flex-col items-center justify-center">
            <h1>Accès refusé</h1>
            <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          </div>
        );
      }