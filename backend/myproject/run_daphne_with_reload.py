from watchfiles import run_process
import subprocess

def run_daphne():
    subprocess.run(["daphne", "-b", "0.0.0.0", "-p", "8000", "myproject.asgi:application"])

    try:
        process.wait()
    except KeyboardInterrupt:
        print("Arrêt en cours...")
        process.terminate()  # Termine le processus proprement
        process.wait()


if __name__ == "__main__":
    try:
        run_process(".", target=run_daphne)
    except KeyboardInterrupt:
        print("Arrêt du serveur de développement.")
