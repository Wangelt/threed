interface TrackingEvent {
  title: string;
  location: string;
  date: string;
  time: string;
}

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

export function TrackingTimeline({ events }: TrackingTimelineProps) {
  return (
    <div>
      {events.map((event, i) => {
        const isFirst = i === 0;
        return (
          <div key={`${event.title}-${i}`} className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <div
                className={`h-3 w-3 shrink-0 rounded-full ${
                  isFirst ? "bg-black" : "border-[1.5px] border-black bg-white"
                }`}
              />
              {i < events.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
            </div>
            <div className="pb-5">
              <p className={`text-sm ${isFirst ? "font-semibold" : "font-medium"}`}>{event.title}</p>
              <p className="mt-0.5 text-xs text-text-secondary">{event.location}</p>
              <p className="mt-0.5 text-[11px] text-text-muted">
                {event.date} · {event.time}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
