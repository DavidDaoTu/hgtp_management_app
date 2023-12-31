import "./calendarCard.scss";
import { MoreVert } from "@mui/icons-material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useEffect, useRef, useState } from "react";

const CalendarCard = ({
    hasHeader,
    title,
    height,
    left,
    center,
    right,
    initialView,
    initialDate,
    editable,
    handleSelect,
    handleDateClick,
    handleEventClick,
    handleEventMouseEnter,
    handleEventMouseLeave,
    handleEventDrop,
    initialEvents,
}) => {
    const [open, setOpen] = useState(false);
    const [activeView, setActiveView] = useState(initialView);
    const calendarRef = useRef(null);

    useEffect(() => {
        const { current: calendarDom } = calendarRef;
        const API = calendarDom ? calendarDom.getApi() : null;
        API && API.changeView(activeView);
    }, [activeView]);

    return (
        <div className="calendarCard">
            {hasHeader && (
                <div className="calendarTop">
                    <h1 className="title">{title}</h1>
                    <div className="iconClick" onClick={() => setOpen(!open)}>
                        <MoreVert className="icon" />
                    </div>
                    {open && (
                        <div className="openMenu">
                            <div
                                className={
                                    "menuItem " +
                                    (activeView === "listMonth" && "active")
                                }
                                onClick={() => {
                                    setActiveView("listMonth");
                                }}
                            >
                                <span className="item">List</span>
                            </div>
                            <div
                                className={
                                    "menuItem " +
                                    (activeView === "dayGridMonth" && "active")
                                }
                                onClick={() => setActiveView("dayGridMonth")}
                            >
                                <span className="item">Month</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="calendarCenter">
                <FullCalendar
                    ref={calendarRef}
                    height={height}
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                        listPlugin,
                    ]}
                    headerToolbar={{
                        left: left,
                        center: center,
                        right: right,
                    }}
                    initialView={activeView}
                    initialDate={initialDate}
                    editable={editable}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    select={handleSelect}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    eventMouseEnter={handleEventMouseEnter}
                    eventMouseLeave={handleEventMouseLeave}
                    eventDrop={handleEventDrop}
                    initialEvents={initialEvents}
                />
            </div>
        </div>
    );
};

export default CalendarCard;
