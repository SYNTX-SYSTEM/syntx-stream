
@app.get("/kalibrierung/cron/stats")
async def get_cron_stats():
    """
    Liefert Echtzeit-Stats aller Cron Jobs
    """
    try:
        # Lade alle Crons
        crons = load_cron_jobs()
        
        # Berechne Stats
        active = 0
        pending = 0
        completed = 0
        failed = 0
        
        for cron in crons:
            status = cron.get("status", "pending")
            if status == "active":
                active += 1
            elif status == "pending":
                pending += 1
            elif status == "completed":
                completed += 1
            elif status == "failed":
                failed += 1
        
        return {
            "erfolg": True,
            "active": active,
            "pending": pending,
            "completed": completed,
            "failed": failed,
            "total": len(crons)
        }
    except Exception as e:
        return {
            "erfolg": False,
            "fehler": str(e)
        }
