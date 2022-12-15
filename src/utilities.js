export function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    }

    return false;
};

export function validatePhone(phone) {
    var pattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if( phone.match(pattern) ) {
        return true;
    }
    return false;
};

export function currentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
};

export function stripPhone(phone) {
    return phone.replace(/\D/g, '');
}

export function formatToCurrency(amount) {
    // if amount is a string, convert it to a number
    if (typeof amount === 'string') {
        amount = parseFloat(amount)
    }

    return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

export function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Function that takes a number with commas as a string and returns a number
export function formatToNumber(number) {
    // check for null or undefined
    if (!number) return
    return parseFloat(number.replace(/,/g, ''));
}
