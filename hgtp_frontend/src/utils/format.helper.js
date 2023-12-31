import dateFormat from "dateformat";

export const formatNumber = (number) => {
    return number.toLocaleString("vn", {
        useGrouping: true,
    });
};

export const formatDate = (date) => {
    if (date) {
        return dateFormat(date, "yyyy-mm-dd");
    }
    return "";
};

export const getDateFromExcelDateNumber = (dateNumber) => {
    if (dateNumber) {
        return new Date(Math.round((dateNumber - 25569) * 86400 * 1000));
    }
    return null;
};
