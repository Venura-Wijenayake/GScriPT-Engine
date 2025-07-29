# backend/key_reset.py

def update_key(key: str, value: str):
    env_path = ".env"
    lines = []
    found = False

    # Read and modify existing lines
    with open(env_path, "r") as f:
        for line in f:
            if line.startswith(f"{key}="):
                lines.append(f'{key}="{value}"\n')
                found = True
            else:
                lines.append(line)

    # If key not found, append it
    if not found:
        lines.append(f'{key}="{value}"\n')

    # Write back updated lines
    with open(env_path, "w") as f:
        f.writelines(lines)
