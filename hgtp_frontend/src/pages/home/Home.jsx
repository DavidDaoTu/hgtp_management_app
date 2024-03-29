import "./home.scss";
import { StoreOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import StatisticsCard from "components/statisticsCard/StatisticsCard";
import CalendarCard from "components/calendarCard/CalendarCard";
import Chart from "components/chart/Chart";
import Regulartable from "components/regulartable/Regulartable";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "utils/apiAxios";
import dateFormat from "dateformat";
import { useRef, useState } from "react";
import { formatDate } from "utils/format.helper";

const today = new Date();
const thisMonth = dateFormat(today, "mm").toUpperCase();
const thisMonthNum = today.getMonth() + 1;
const thisYearNum = today.getFullYear();

const stats = [
    {
        id: 1,
        title: "TỔNG CONT",
        menu: [],
        query: `products`,
        isMoney: false,
        to: `/products`,
        link: "Xem tất cả",
        icon: (
            <StoreOutlined
                className="icon"
                style={{
                    color: "green",
                    backgroundColor: "rgba(0, 128, 0, 0.2)",
                }}
            />
        ),
    },
    {
        id: 2,
        title: "TỔNG CONT ĐÃ BÁN",
        menu: ["pending", "sold", "done"],
        query: `productsWithStatus?status=done`,
        isMoney: false,
        to: `/products?status=done`,
        link: "Xem tất cả",
        icon: (
            <StoreOutlined
                className="icon"
                style={{
                    color: "green",
                    backgroundColor: "rgba(0, 128, 0, 0.2)",
                }}
            />
        ),
    },
    {
        id: 3,
        title: `CONT THÁNG ${thisMonth} ${thisYearNum}`,
        menu: [thisMonth],
        query: `productsMonth?month=${thisMonthNum}&year=${thisYearNum}`,
        isMoney: false,
        to: `/products?startArrivalDate=${thisYearNum}-${thisMonthNum}-01&endArrivalDate=${thisYearNum}-${thisMonthNum}-31`,
        link: "Xem tất cả",
        icon: (
            <ShoppingCartOutlined
                className="icon"
                style={{
                    color: "goldenrod",
                    backgroundColor: "rgba(218, 165, 32, 0.2)",
                }}
            />
        ),
    },
    {
        id: 4,
        title: "CONT CHƯA BÁN",
        menu: [],
        query: `productsInStock`,
        isMoney: false,
        to: `/products?status=pending`,
        link: "Xem tất cả",
        icon: (
            <ShoppingCartOutlined
                className="icon"
                style={{
                    color: "crimson",
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                }}
            />
        ),
    },
];

const Home = () => {
    const [open, setOpen] = useState(false);
    const [event, setEvent] = useState();
    const [position, setPosition] = useState({
        position: "absolute",
        top: 0,
        left: 0,
    });
    const calendarElement = useRef(null);

    const {
        isLoading: isLoadingProducts,
        error: errorProducts,
        data: dataProducts,
    } = useQuery({
        queryKey: ["pending", "product"],
        queryFn: async () => {
            const res = await apiRequest.get(
                `/products?status=pending&sortName=arrivalDate`
            );
            return res.data;
        },
    });

    const {
        isLoading: isLoadingSellerChart,
        error: errorSellerChart,
        data: dataSellerChart,
    } = useQuery({
        queryKey: ["home", "seller"],
        queryFn: async () => {
            const res = await apiRequest.get(
                `/analys/productsPerUserByMonth?year=${thisYearNum}`
            );
            return res.data;
        },
    });

    const {
        isLoading: isLoadingKpiChart,
        error: errorKpiChart,
        data: dataKpiChart,
    } = useQuery({
        queryKey: ["home", "kpi"],
        queryFn: async () => {
            const res = await apiRequest.get(
                `/analys/productsPerUserOneMonth?year=${thisYearNum}&month=${thisMonthNum}`
            );
            return res.data;
        },
    });

    const {
        isLoading: isLoadingProductEvent,
        error: errorProductEvent,
        data: dataProductEvent,
    } = useQuery({
        queryKey: ["events"],
        queryFn: async () => {
            const res = await apiRequest.get(`/productevent`);
            return res.data;
        },
    });

    const handleHoverEventIn = async (selected) => {
        const navbar = document.getElementById("navbar");
        const navbarHeight = navbar.offsetHeight;
        const sidebar = document.getElementById("sidebar");
        const sidebarWidth = sidebar.offsetWidth;
        const statistics = document.getElementById("statistics");
        const statisticsWidth = statistics.offsetWidth;
        const top =
            selected.jsEvent.clientY -
            selected.jsEvent.layerY -
            navbarHeight -
            40;
        const left =
            selected.jsEvent.clientX -
            selected.jsEvent.layerX -
            sidebarWidth -
            statisticsWidth -
            40;
        if (left > calendarElement.current.offsetWidth / 2) {
            setPosition({
                ...position,
                top: top,
                left: left - 10,
                transform: "translate(-100%, 0)",
            });
        } else {
            setPosition({
                ...position,
                top: top,
                left: left + selected.el.offsetWidth + 10,
                transform: "translate(0, 0)",
            });
        }
        const res = await apiRequest.get(`/products/${selected.event.title}`);
        setEvent(res.data);
        setOpen(true);
    };

    const handleHoverEventOut = () => {
        setOpen(false);
    };

    return (
        <div className="home">
            <div className="homeTop">
                <div className="homeStats">
                    {stats?.map((stat) => (
                        <StatisticsCard stat={stat} key={stat.id} />
                    ))}
                </div>
                <div className="homeCalendar" ref={calendarElement}>
                    {isLoadingProductEvent ? (
                        "Loading..."
                    ) : errorProductEvent ? (
                        <CalendarCard
                            hasHeader={true}
                            title={errorProductEvent.message}
                            height="auto"
                            center="title"
                            initialView="dayGridMonth"
                            editable={false}
                            handleEventMouseEnter={handleHoverEventIn}
                            handleEventMouseLeave={handleHoverEventOut}
                            initialEvents={null}
                        />
                    ) : (
                        <CalendarCard
                            hasHeader={true}
                            title={`Lịch hàng về và lịch giao hàng`}
                            height="auto"
                            left="prev,next today"
                            center="title"
                            right="dayGridMonth dayGridWeek"
                            initialView="dayGridMonth"
                            editable={false}
                            handleEventMouseEnter={handleHoverEventIn}
                            handleEventMouseLeave={handleHoverEventOut}
                            initialEvents={dataProductEvent}
                        />
                    )}
                    <div
                        className={`calendarEvent ${
                            open ? "active" : "disable"
                        }`}
                        style={position}
                    >
                        <div className="eventDetail">
                            <span className="text title">
                                {event?.productId}
                            </span>
                            <span className="text">
                                Category: {event?.category?.title}
                            </span>
                            <span className="text">
                                Seller: {event?.seller?.name}
                            </span>
                            <span className="text">
                                Customer: {event?.customer?.name}
                            </span>
                            <span className="text">
                                Ngày về: {formatDate(event?.arrivalDate)}
                            </span>
                            <span className="text">
                                Ngày giao: {formatDate(event?.deliveryDate)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="homeMiddle">
                <div className="homeChart">
                    {isLoadingSellerChart ? (
                        "Loading..."
                    ) : errorSellerChart ? (
                        <Chart
                            title={errorSellerChart.message}
                            aspect={2 / 1}
                            data={null}
                            initChart="LineChart"
                            dataKey="month"
                        />
                    ) : (
                        <Chart
                            title={`Thống kê KPI theo tháng ${thisYearNum}`}
                            aspect={2 / 1}
                            data={dataSellerChart}
                            initChart="LineChart"
                            dataKey="month"
                        />
                    )}
                </div>
                <div className="homeChart">
                    {isLoadingKpiChart ? (
                        "Loading..."
                    ) : errorKpiChart ? (
                        <Chart
                            title={errorKpiChart.message}
                            aspect={2 / 1}
                            data={null}
                            initChart="LineChart"
                            dataKey="month"
                        />
                    ) : (
                        <Chart
                            title={`KPI tháng ${thisMonth} ${thisYearNum}`}
                            aspect={2 / 1}
                            data={dataKpiChart}
                            initChart="BarChart"
                            dataKey="name"
                        />
                    )}
                </div>
            </div>
            <div className="homeBottom">
                <div className="homeList">
                    {isLoadingProducts ? (
                        "Loading..."
                    ) : errorProducts ? (
                        <Regulartable
                            title={errorProducts.message}
                            products={null}
                        />
                    ) : (
                        <Regulartable
                            title="Cont chưa bán"
                            products={dataProducts}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
