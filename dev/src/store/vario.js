import { parseIGC } from '../lib/parseigc.js'
import { waitFor, triFichiers, triParNomInverse, updateTreeContent } from '../lib/helperStore.js'
import { preferences } from '../preferences.js'

const env = process.env;

const initialState = {
    configLoaded: false,
    config: false,
    configWebLoaded: false,
    configWeb: preferences,
    configWifiLoaded: false,
    configWifi: false,
    flightsLoaded: false,
    flights: false,
    fileslistLoaded: false,
    fileslist: false,
    isLoading: false,
    uploadPct: 0,
    firmwareVersion: ''
};

const baseUrl = 'http://192.168.1.80';

export const state = Object.assign({}, initialState);

export const actions = {
    loadConfig: function (context) {
        let url = "/params";
        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = baseUrl + "/params";
        }

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                let config = response.data;
                context.commit('setConfig', config);
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    saveConfig: function (context) {
        let url = "/params";

        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            // eslint-disable-next-line
            return axios.post(url, context.state.config).then(_response => {
                return true;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    loadConfigWeb: function (context) {
        let url = "/webconfig";
        if (env.NODE_ENV == "development") {
            //url = "config/params.jso";
            url = baseUrl + "/webconfig";
        }

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                let configWeb = {
                    ...context.state.configWeb,
                    ...response.data,
                };
                context.commit('setConfigWeb', configWeb);
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    saveConfigWeb: function (context) {
        let url = "/webconfig";

        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            // eslint-disable-next-line
            return axios.post(url, context.state.configWeb).then(_response => {
                return true;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    loadWifiConfig: function (context) {
        let url = "/wifi";
        if (env.NODE_ENV == "development") {
            url = "config/wifi.cfg";
        }

        let axiosConfig = {
            headers: {
                "Content-Type": "application/octet-stream"
            }
        };

        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                let config = response.data;
                context.commit('setconfigWifi', config);
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    saveWifiConfig: function (context) {
        let url = "/wifi";

        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);

            var config = {
                headers: {
                    'Content-Type': 'text/plain'
                },
                responseType: 'text'
            };

            // eslint-disable-next-line
            return axios.post(url, context.state.configWifi, config).then(response => {
                return true;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    loadFlights: function (context) {
        let url = "/flights";
        if (env.NODE_ENV == "development") {
            //url = "config/flights.jso";
            url = baseUrl + url;
        }

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                let d = response.data;
                triParNomInverse(d);
                let traceFiles;
                d = d.filter(function (e) {
                    return e.type == "file";
                });
                traceFiles = d.map(f => {
                    return { name: f.name.substring(f.name.lastIndexOf("/") + 1), size: f.size };
                });
                context.commit('setFlights', traceFiles);
                // eslint-disable-next-line no-unused-vars
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    downloadFlight: function (context, filename) {
        let url = "/file?path=/vols/" + filename;

        if (env.NODE_ENV == "development") {
            //url = "config/flights.jso";
            url = baseUrl + url;
        }

        // if (env.NODE_ENV == "development") {
        //     url = "/19022402.IGC";
        // }

        let axiosConfig = {}
        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                return response;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    deleteFlight: function (context, filename) {
        let url = "/file?path=/vols/" + filename;
        if (env.NODE_ENV == "development") {
            url = "/index.htm";
        }

        let axiosConfig = {}
        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.delete(url, axiosConfig).then(response => {
                return response;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    infoFlight: function (context, filename) {
        let url = "/file?path=/vols/" + filename;

        if (env.NODE_ENV == "development") {
            // url = "config/20010500_concat.IGC";
            url = baseUrl + url;
        }

        // if (env.NODE_ENV == "development") {
        //     url = "/19022402.IGC";
        // }

        let axiosConfig = {}
        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                const data = response.data;
                const igc = parseIGC(data);
                return igc;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    loadSDFiles: function (context, path) {
        let url = "/list";
        if (path) {
            url = url + "?dir=" + path + "&norecursive=true";
        }
        if (env.NODE_ENV == "development") {
            //url = "config/tree.jso";
            url = baseUrl + url;
        }

        let axiosConfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                let tree = response.data;
                triFichiers(tree);
                context.commit('setFiles', { fileslist: tree, path: path });
                // eslint-disable-next-line no-unused-vars
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    downloadFile: function (context, filename) {
        let url = "/file?path=" + filename;
        if (env.NODE_ENV == "development") {
            url = "/19022402.IGC";
        }
        let axiosConfig = {}
        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                return response;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    uploadFile: function (context, formData) {
        let url = "/upload";
        if (env.NODE_ENV == "development") {
            url = baseUrl + "/upload";
        }
        context.commit('setUploadpct', 0);
        return waitFor(function () {
            return (context.state.isLoading === false);
        }).then(function () {
            context.commit('setLoadingState', true);

            var config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: function (progressEvent) {
                    let pct = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    context.commit('setUploadpct', pct);
                }
            };

            return axios.post(url, formData, config).then(response => {
                // console.log(response);
                return response;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setUploadpct', 0);
                context.commit('setLoadingState', false);
            });
        });
    },
    deleteFile: function (context, filename) {
        let url = encodeURI("/file?path=" + filename);
        if (env.NODE_ENV == "development") {
            url = baseUrl + url;
        }

        let axiosConfig = {}
        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.delete(url, axiosConfig).then(response => {
                return response;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    loadFirmwareVersion: function (context) {
        let url = "/firmwareversion";
        if (env.NODE_ENV == "development") {
            url = baseUrl + url;
        }
        let axiosConfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            return axios.get(url, axiosConfig).then(response => {
                context.commit('setFirmwareVersion', response.data);
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    },
    upgradeFirmware: function (context, beta) {
        let url = "/upgradeweb?beta=" + beta;
        if (env.NODE_ENV == "development") {
            url = baseUrl + url;
        }
        let axiosConfig = {

        };
        return waitFor(function () {
            return context.state.isLoading === false
        }).then(function () {
            context.commit('setLoadingState', true);
            // eslint-disable-next-line no-unused-vars
            return axios.get(url, axiosConfig).then(response => {
                return true;
            }).catch(function (error) {
                return Promise.reject(error);
            }).finally(function () {
                context.commit('setLoadingState', false);
            });
        });
    }
}

export const mutations = {
    setConfig: function (state, config) {
        state.config = Object.assign({}, state.config, config);
        state.configLoaded = true;
    },
    setConfigWeb: function (state, config) {
        state.configWeb = Object.assign({}, state.configWeb, config);
        state.configWebLoaded = true;
    },
    updateConfigWeb: function (state, payload) {
        var apply = function (data, mods) {
            for (var path in mods) {
                var k = data;
                var steps = path.split('.');
                var last = steps.pop();
                steps.forEach(e => (k[e] = k[e] || {}) && (k = k[e]));
                k[last] = mods[path];
            }
            return data;
        }

        var modsStr = "{\"" + payload.property + "\":\"" + payload.with + "\"}";
        var mods = JSON.parse(modsStr);
        let ob = apply(state.configWeb, mods);
        state.configWeb = Object.assign({}, state.configWeb, ob);
    },
    setconfigWifi: function (state, config) {
        state.configWifi = config;
        state.configWifiLoaded = true;
    },
    setFlights: function (state, flights) {
        state.flights = Object.assign({}, state.flights, flights);
        state.flightsLoaded = true;
    },
    setLoadingState: function (state, isLoading) {
        state.isLoading = isLoading;
    },
    setFiles: function (state, { fileslist, path }) {
       
        if (state.fileslist) {
            //on doit juste remplacer un morceau de l'arbre
            var newTree = {};
            let dirs = path.split('/').filter(function (el) {
                return el != "";
            });
            dirs.unshift('/');
            var subPart = state.fileslist[0];
            newTree = subPart;
            updateTreeContent(newTree, dirs, fileslist);
        } else {
            state.fileslist = Object.assign({}, state.fileslist, fileslist);
        }

        state.fileslistLoaded = true;
    },
    setUploadpct: function (state, pct) {
        state.uploadPct = pct;
    },
    setFirmwareVersion: function (state, v) {
        state.firmwareVersion = v;
    },

}

const getters = {
    config(state) {
        return state.configLoaded ? state.config : false;
    },
    configWeb(state) {
        return state.configWebLoaded ? state.configWeb : false;
    },
    configWifi(state) {
        return state.configWifiLoaded ? state.configWifi : false;
    },
    flights(state) {
        return state.flightsLoaded ? state.flights : false;
    },
    fileslist(state) {
        return state.fileslistLoaded ? state.fileslist : false;
    },
    isLoading(state) {
        return state.isLoading;
    },
    uploadPct(state) {
        return state.uploadPct;
    },
    firmwareVersion(state) {
        return state.firmwareVersion;
    },
    themeName(state) {
        return state.configWeb.theme.name;
    },
    themeVariant(state) {
        return state.configWeb.theme.variant;
    },
    themeType(state) {
        return state.configWeb.theme.type;
    },
    lang(state) {
        return state.configWeb.language;
    }
}

export default {
    state,
    actions,
    mutations,
    getters
};


