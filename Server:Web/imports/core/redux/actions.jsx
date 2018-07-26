/**
 * Feed redux actions
 */
function fetchXHR(url, method, data) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open(method, url, true);
        request.setRequestHeader('Content-Type', 'application/JSON');
        request.send(JSON.stringify(data));
        request.onreadystatechange = function handleResponse() {
            if (this.responseText !== undefined && this.responseText !== ''
                && this.responseText !== null && this.responseText !== ' '
                && this.responseText[this.responseText.length - 1] === '}') {
                const response = {
                    json: JSON.parse(this.responseText),
                    status: {
                        info: this.statusText,
                        code: this.status
                    }
                };
                resolve(response);
            }
        };
        request.onerror = function handleError(error) {
            reject(error);
        };
    });
}

/**
 * Redux actions list config
 */

export const REQUEST_DATA = 'REQUEST_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';
export const ERROR_DATA = 'ERROR_DATA';
export const CLEAN_DATA = 'CLEAN_DATA';

function fetchDataAPI() {
    return (dispatch) => {
        return dispatch({
            type: RECEIVE_DATA,
            data: UserAdmin.find({}).fetch(),
            status: { code: 200, info: 'Ok' }
        });
    };
}

export const CoreActions = {
    fetchData: function fetchData() {
        return (dispatch) => dispatch(fetchDataAPI());
    }
};
