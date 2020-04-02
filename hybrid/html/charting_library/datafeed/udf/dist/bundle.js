! function (e, t) {
  "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(e.Datafeeds = {})
}(this, function (e) {
  "use strict";
  //获取时间
  function GetDateStr(date,AddDayCount) {
    var a = null;
    var dates = null;
    if (typeof date == 'object') {
      dates = date;
    } else if (Number(date)) {
      dates = new Date(date);
    } else {
      a = date.split(/[^0-9]/);
      dates = new Date(a[0], a[1] - 1, a[2], a[3] ? a[3] : '', a[4] ? a[4] : '', a[5] ? a[5] : '');
    }
    var dd = dates
    dd.setDate(dd.getDate() - AddDayCount); //获取AddDayCount天前的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1; //获取当前月份的日期
    var d = String(dd.getDate()).length < 2 ? '0' + dd.getDate() + '' : dd.getDate();
    // var d = dd.getDate();
    console.log(y + '-' + (Number(m + '') < 10 ? '0' + m : m) + '-' + d)
    return new Date(y + '-' + (Number(m + '') < 10 ? '0' + m : m) + '-' + d).getTime() / 1000;
  }
  
  function formta(date, fmt) {
    var a = null;
    var dates = null;
    if (typeof date == 'object') {
      dates = date;
    } else if (Number(date)) {
      dates = new Date(date);
    } else {
      a = date.split(/[^0-9]/);
      dates = new Date(a[0], a[1] - 1, a[2], a[3] ? a[3] : '', a[4] ? a[4] : '', a[5] ? a[5] : '');
    }

    var o = {
      "M+": dates.getMonth() + 1, //月份   
      "d+": dates.getDate(), //日   
      "h+": dates.getHours(), //小时   
      "m+": dates.getMinutes(), //分   
      "s+": dates.getSeconds(), //秒   
      "q+": Math.floor((dates.getMonth() + 3) / 3), //季度   
      "S": dates.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (dates.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  var t = Object.setPrototypeOf || {
    __proto__: []
  }
  instanceof Array && function (e, t) {
    e.__proto__ = t
  } || function (e, t) {
    for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
  };
  var r = !1;

  function n(e) {
    if (r) {
      var t = new Date;
      console.log(t.toLocaleTimeString() + "." + t.getMilliseconds() + "> " + e)
    }
  }

  function c(e) {
    return void 0 === e ? "" : "string" == typeof e ? e : e.message
  }
  var i = (s.prototype.getBars = function (e, t, r, s, type) {
    function formartResolution(val) {
      if (val) {
        if (/^\d+$/.test(val) && val < 60) {
          return val + 'm';
        } else if (val.indexOf('D') > -1) {
          return '1d'
        } else {
          return '1h'
        }
      } else {
        return '1h'
      }
    }
    var o = this,
      i = {
        // symbol: e.ticker || "",
        // resolution: t,
        // from: r,
        // to: s,
        // pageSize:300,
        startTime: t== '1D' ? GetDateStr(s * 1000,300) : r,
        endTime: type == 'Now' ? s : t == '1D' ? e.lastDate || s : t== '15' ? e.lastDate || s : s,
        pageSize: 300,
        // pageNum:1,
        symbol: e.ticker.toUpperCase(),
        kline: formartResolution(t)
      };
      if(e.KLine != t){
        i.endTime = s;
      }
      e.KLine = t;
      var getData = 'startTime='+i.startTime+'&endTime='+i.endTime+'&pageSize='+i.pageSize+'&symbol='+i.symbol+'&kline='+i.kline;
    return new Promise(function (a, u) {
      o._requester.sendRequest(o._datafeedUrl,'/dataload/kline-query/pages',i).then(function (ee) {
        if ("100200" === ee.code) {
          var t = [],
            r = {
              noData: 1
            };
          if (ee.data.pages.size == '0') {
            r.noData = !0, r.nextTime = e.lastDate;
          } else {
            var len = ee.data.pages.list.reverse();
            var lenV = [];
            var lenO = [];
            var lenH = [];
            var lenL = [];
            var lenT = [];
            var lenC = [];
            for (var i of len) {
              lenV.push(i.amount);
              lenO.push(i.open);
              lenH.push(i.maxPrice);
              lenL.push(i.lowPrice);
              lenT.push(i.time);
              lenC.push(i.close);
            }
            var arr = [];
            for (var s = void 0 !== lenV, o = void 0 !== lenO, i = 0; i < len.length; ++i) {
              var n = {
                time: 1e3 * lenT[i],
                close: Number(lenC[i]),
                open: Number(lenC[i]),
                high: Number(lenC[i]),
                low: Number(lenC[i])
              };
              if (o) {
                n.open = Number(lenO[i]);
                n.high = Number(lenH[i]);
                n.low = Number(lenL[i]);
              }
              if (s) {
                n.volume = Number(lenV[i])
              }
              t.push(n)
              e.lastDate = len[0].time;
            }
          }
          a({
            bars: t,
            meta: {
              noData: true,
              nextTime: r
            }
          })
        } else u(ee.msg)
      }).catch(function (e) {
        var t = c(e);
        console.warn("HistoryProvider: getBars() failed, error=" + t), u(t)
      })
    })
  }, s);

  function s(e, t) {
    this._datafeedUrl = e, this._requester = t
  }
  var a = (o.prototype.subscribeBars = function (e, t, r, s) {
    this._subscribers.hasOwnProperty(s) ? n("DataPulseProvider: already has subscriber with id=" + s) : (this._subscribers[s] = {
      lastBarTime: null,
      listener: r,
      resolution: t,
      symbolInfo: e
    }, n("DataPulseProvider: subscribed for #" + s + " - {" + e.name + ", " + t + "}"))
  }, o.prototype.unsubscribeBars = function (e) {
    delete this._subscribers[e], n("DataPulseProvider: unsubscribed for #" + e)
  }, o.prototype._updateData = function () {
    var r = this;
    if (!(0 < this._requestsPending)) {
      this._requestsPending = 0;
      var e = function (t) {
          s._requestsPending += 1, s._updateDataForSubscriber(t).then(function () {
            r._requestsPending -= 1, n("DataPulseProvider: data for #" + t + " updated successfully, pending=" + r._requestsPending)
          }).catch(function (e) {
            r._requestsPending -= 1, n("DataPulseProvider: data for #" + t + " updated with error=" + c(e) + ", pending=" + r._requestsPending)
          })
        },
        s = this;
      for (var t in this._subscribers) e(t)
    }
  }, o.prototype._updateDataForSubscriber = function (t) {
    var r = this,
      e = this._subscribers[t],
      s = parseInt((Date.now() / 1e3).toString()),
      o = s - function (e, t) {
        return 24 * ("D" === e || "1D" === e ? t : "M" === e || "1M" === e ? 31 * t : "W" === e || "1W" === e ? 7 * t : t * parseInt(e) / 1440) * 60 * 60
      }(e.resolution, 10);
    // console.log(2)
    return this._historyProvider.getBars(e.symbolInfo, e.resolution, o, s, 'Now').then(function (e) {
      r._onSubscriberDataReceived(t, e)
    })
  }, o.prototype._onSubscriberDataReceived = function (e, t) {
    if (this._subscribers.hasOwnProperty(e)) {
      var r = t.bars;
      if (0 !== r.length) {
        var s = r[r.length - 1],
          o = this._subscribers[e];
        if (!(null !== o.lastBarTime && s.time < o.lastBarTime)) {
          if (null !== o.lastBarTime && s.time > o.lastBarTime) {
            if (r.length < 2) throw new Error("Not enough bars in history for proper pulse update. Need at least 2.");
            var i = r[r.length - 2];
            o.listener(i)
          }
          o.lastBarTime = s.time, o.listener(s)
        }
      }
    } else n("DataPulseProvider: Data comes for already unsubscribed subscription #" + e)
  }, o);

  function o(e, t) {
    this._subscribers = {}, this._requestsPending = 0, this._historyProvider = e, setInterval(this._updateData.bind(this), t)
  }
  var u = (l.prototype.subscribeQuotes = function (e, t, r, s) {
    this._subscribers[s] = {
      symbols: e,
      fastSymbols: t,
      listener: r
    }, n("QuotesPulseProvider: subscribed quotes with #" + s)
  }, l.prototype.unsubscribeQuotes = function (e) {
    delete this._subscribers[e], n("QuotesPulseProvider: unsubscribed quotes with #" + e)
  }, l.prototype._updateQuotes = function (s) {
    var o = this;
    if (!(0 < this._requestsPending)) {
      var e = function (t) {
          i._requestsPending++;
          var r = i._subscribers[t];
          i._quotesProvider.getQuotes(1 === s ? r.fastSymbols : r.symbols).then(function (e) {
            o._requestsPending--, o._subscribers.hasOwnProperty(t) && (r.listener(e), n("QuotesPulseProvider: data for #" + t + " (" + s + ") updated successfully, pending=" + o._requestsPending))
          }).catch(function (e) {
            o._requestsPending--, n("QuotesPulseProvider: data for #" + t + " (" + s + ") updated with error=" + c(e) + ", pending=" + o._requestsPending)
          })
        },
        i = this;
      for (var t in this._subscribers) e(t)
    }
  }, l);

  function l(e) {
    this._subscribers = {}, this._requestsPending = 0, this._quotesProvider = e, setInterval(this._updateQuotes.bind(this, 1), 1e4), setInterval(this._updateQuotes.bind(this, 0), 6e4)
  }

  function d(e, t, r, s) {
    var o = e[t];
    return !Array.isArray(o) || s && !Array.isArray(o[0]) ? o : o[r]
  }
  var h = (f.prototype.resolveSymbol = function (t) {
    var r = this;
    return this._readyPromise.then(function () {
      var e = r._symbolsInfo[t];
      // return void 0 === e ? Promise.reject("invalid symbol") : Promise.resolve(e)
    })
  }, f.prototype.searchSymbols = function (a, u, c, o) {
    var l = this;
    return this._readyPromise.then(function () {
      var i = [],
        n = 0 === a.length;
      a = a.toUpperCase();
      for (var e = function (e) {
          var t = l._symbolsInfo[e];
          if (void 0 === t) return "continue";
          if (0 < c.length && t.type !== c) return "continue";
          if (u && 0 < u.length && t.exchange !== u) return "continue";
          var r = t.name.toUpperCase().indexOf(a),
            s = t.description.toUpperCase().indexOf(a);
          if ((n || 0 <= r || 0 <= s) && !i.some(function (e) {
              return e.symbolInfo === t
            })) {
            var o = 0 <= r ? r : 8e3 + s;
            i.push({
              symbolInfo: t,
              weight: o
            })
          }
        }, t = 0, r = l._symbolsList; t < r.length; t++) e(r[t]);
      var s = i.sort(function (e, t) {
        return e.weight - t.weight
      }).slice(0, o).map(function (e) {
        var t = e.symbolInfo;
        return {
          symbol: t.name,
          full_name: t.full_name,
          description: t.description,
          exchange: t.exchange,
          params: [],
          type: t.type,
          ticker: t.name
        }
      });
      return Promise.resolve(s)
    })
  }, f.prototype._init = function () {
    for (var e = this, t = [], r = {}, s = 0, o = this._exchangesList; s < o.length; s++) {
      var i = o[s];
      r[i] || (r[i] = !0, t.push(this._requestExchangeData(i)))
    }
    return Promise.all(t).then(function () {
      e._symbolsList.sort(), n("SymbolsStorage: All exchanges data loaded")
    })
  }, f.prototype._requestExchangeData = function (s) {
    var o = this;
    // return new Promise(function (t, r) {
    //   o._requester.sendRequest(o._datafeedUrl, "symbol_info", {
    //     group: s
    //   }).then(function (e) {
    //     try {
    //       o._onExchangeDataReceived(s, e)
    //     } catch (e) {
    //       return void r(e)
    //     }
    //     t()
    //   }).catch(function (e) {
    //     n("SymbolsStorage: Request data for exchange '" + s + "' failed, reason=" + c(e)), t()
    //   })
    // })
  }, f.prototype._onExchangeDataReceived = function (t, r) {
    var e = this,
      s = 0;
    try {
      for (var o = r.symbol.length, i = void 0 !== r.ticker; s < o; ++s) {
        var n = r.symbol[s],
          a = d(r, "exchange-listed", s),
          u = d(r, "exchange-traded", s),
          c = u + ":" + n,
          l = i ? d(r, "ticker", s) : n,
          h = {
            ticker: l,
            name: n,
            base_name: [a + ":" + n],
            full_name: c,
            listed_exchange: a,
            exchange: u,
            description: d(r, "description", s),
            has_intraday: p(d(r, "has-intraday", s), !1),
            has_no_volume: p(d(r, "has-no-volume", s), !1),
            minmov: d(r, "minmovement", s) || d(r, "minmov", s) || 0,
            minmove2: d(r, "minmove2", s) || d(r, "minmov2", s),
            fractional: d(r, "fractional", s),
            pricescale: d(r, "pricescale", s),
            type: d(r, "type", s),
            session: d(r, "session-regular", s),
            timezone: d(r, "timezone", s),
            supported_resolutions: p(d(r, "supported-resolutions", s, !0), e._datafeedSupportedResolutions),
            force_session_rebuild: d(r, "force-session-rebuild", s),
            has_daily: p(d(r, "has-daily", s), !0),
            intraday_multipliers: p(d(r, "intraday-multipliers", s, !0), ["1", "5", "15", "30", "60"]),
            has_weekly_and_monthly: d(r, "has-weekly-and-monthly", s),
            has_empty_bars: d(r, "has-empty-bars", s),
            volume_precision: p(d(r, "volume-precision", s), 0)
          };
        e._symbolsInfo[l] = h, e._symbolsInfo[n] = h, e._symbolsInfo[c] = h, e._symbolsList.push(n)
      }
    } catch (e) {
      throw new Error("SymbolsStorage: API error when processing exchange " + t + " symbol #" + s + " (" + r.symbol[s] + "): " + e.message)
    }
  }, f);

  function f(e, t, r) {
    this._exchangesList = ["NYSE", "FOREX", "AMEX"], this._symbolsInfo = {}, this._symbolsList = [], this._datafeedUrl = e, this._datafeedSupportedResolutions = t, this._requester = r, this._readyPromise = this._init(), this._readyPromise.catch(function (e) {
      console.error("SymbolsStorage: Cannot init, error=" + e.toString())
    })
  }

  function p(e, t) {
    return void 0 !== e ? e : t
  }

  function _(e, t, r) {
    var s = e[t];
    return Array.isArray(s) ? s[r] : s
  }
  var m = (b.prototype.onReady = function (e) {
    var t = this;
    this._configurationReadyPromise.then(function () {
      e(t._configuration)
    })
  }, b.prototype.getQuotes = function (e, t, r) {
    this._quotesProvider.getQuotes(e).then(t).catch(r)
  }, b.prototype.subscribeQuotes = function (e, t, r, s) {
    this._quotesPulseProvider.subscribeQuotes(e, t, r, s)
  }, b.prototype.unsubscribeQuotes = function (e) {
    this._quotesPulseProvider.unsubscribeQuotes(e)
  }, b.prototype.calculateHistoryDepth = function (e, t, r) {}, b.prototype.getMarks = function (e, t, r, s, o) {
    if (this._configuration.supports_marks) {
      var i = {
        symbol: e.ticker || "",
        from: t,
        to: r,
        resolution: o
      };
      this._send("marks", i).then(function (e) {
        if (!Array.isArray(e)) {
          for (var t = [], r = 0; r < e.id.length; ++r) t.push({
            id: _(e, "id", r),
            time: _(e, "time", r),
            color: _(e, "color", r),
            text: _(e, "text", r),
            label: _(e, "label", r),
            labelFontColor: _(e, "labelFontColor", r),
            minSize: _(e, "minSize", r)
          });
          e = t
        }
        s(e)
      }).catch(function (e) {
        n("UdfCompatibleDatafeed: Request marks failed: " + c(e)), s([])
      })
    }
  }, b.prototype.getTimescaleMarks = function (e, t, r, s, o) {
    if (this._configuration.supports_timescale_marks) {
      var i = {
        symbol: e.ticker || "",
        from: t,
        to: r,
        resolution: o
      };
      this._send("timescale_marks", i).then(function (e) {
        if (!Array.isArray(e)) {
          for (var t = [], r = 0; r < e.id.length; ++r) t.push({
            id: _(e, "id", r),
            time: _(e, "time", r),
            color: _(e, "color", r),
            label: _(e, "label", r),
            tooltip: _(e, "tooltip", r)
          });
          e = t
        }
        s(e)
      }).catch(function (e) {
        n("UdfCompatibleDatafeed: Request timescale marks failed: " + c(e)), s([])
      })
    }
  }, b.prototype.getServerTime = function (r) {
    this._configuration.supports_time && r(new Date().getTime() / 1000)
    // this._configuration.supports_time && this._send("time").then(function (e) {
    //   var t = parseInt(e);
    //   isNaN(t) || r(t)
    // }).catch(function (e) {
    //   n("UdfCompatibleDatafeed: Fail to load server time, error=" + c(e))
    // })
  }, b.prototype.searchSymbols = function (t, e, r, s) {
    if (this._configuration.supports_search) {
      var o = {
        limit: 30,
        query: t.toUpperCase(),
        type: r,
        exchange: e
      };
      this._send("search", o).then(function (e) {
        if (void 0 !== e.s) return n("UdfCompatibleDatafeed: search symbols error=" + e.errmsg), void s([]);
        s(e)
      }).catch(function (e) {
        n("UdfCompatibleDatafeed: Search symbols for '" + t + "' failed. Error=" + c(e)), s([])
      })
    } else {
      if (null === this._symbolsStorage) throw new Error("UdfCompatibleDatafeed: inconsistent configuration (symbols storage)");
      this._symbolsStorage.searchSymbols(t, e, r, 30).then(s).catch(s.bind(null, []))
    }
  }, b.prototype.resolveSymbol = function (e, t, r) {
    n("Resolve requested");
    var s = Date.now();

    function o(e) {
      n("Symbol resolved: " + (Date.now() - s) + "ms"), t(e)
    }
    if (this._configuration.supports_group_request) {
      if (null === this._symbolsStorage) throw new Error("UdfCompatibleDatafeed: inconsistent configuration (symbols storage)");
      this._symbolsStorage.resolveSymbol(e).then(o).catch(r)
    } else {
      var i = {
        symbol: e
      };
      this._send("/hybrid/html/charting_library/datafeed/configs/symbols.json", i).then(function (data) {
        data.description = e;
        data.name = e;
        data.ticker = e;
		let price = localStorage.getItem('PRICEPRECISION');
		data.pricescale = Math.pow(10,price);
        void 0 !== data.s ? r("unknown_symbol") : o(data)
      }).catch(function (e) {
        n("UdfCompatibleDatafeed: Error resolving symbol: " + c(e)), r("unknown_symbol")
      })
    }
  }, b.prototype.getBars = function (e, t, r, s, o, i) {
    // console.log(1)
    this._historyProvider.getBars(e, t, r, s, 'Past').then(function (e) {
      o(e.bars, e.meta)
    }).catch(i)
  }, b.prototype.subscribeBars = function (e, t, r, s, o) {
    this._dataPulseProvider.subscribeBars(e, t, r, s)
  }, b.prototype.unsubscribeBars = function (e) {
    this._dataPulseProvider.unsubscribeBars(e)
  }, b.prototype._requestConfiguration = function () {
    return this._send("/hybrid/html/charting_library/datafeed/configs/config.json").catch(function (e) {
      return n("UdfCompatibleDatafeed: Cannot get datafeed configuration - use default, error=" + c(e)), null
    })
  }, b.prototype._send = function (e, t) {
    return this._requester.sendRequest(this._datafeedURL, e, t)
  }, b.prototype._setupWithConfiguration = function (e) {
    if (void 0 === (this._configuration = e).exchanges && (e.exchanges = []), !e.supports_search && !e.supports_group_request) throw new Error("Unsupported datafeed configuration. Must either support search, or support group request");
    !e.supports_group_request && e.supports_search || (this._symbolsStorage = new h(this._datafeedURL, e.supported_resolutions || [], this._requester)), n("UdfCompatibleDatafeed: Initialized with " + JSON.stringify(e))
  }, b);

  function b(e, t, r, s) {
    void 0 === s && (s = 1e4);
    var o = this;
    this._configuration = {
      supports_search: !1,
      supports_group_request: !0,
      supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
      supports_marks: !1,
      supports_timescale_marks: !1
    }, this._symbolsStorage = null, this._datafeedURL = e, this._requester = r, this._historyProvider = new i(e, this._requester), this._quotesProvider = t, this._dataPulseProvider = new a(this._historyProvider, s), this._quotesPulseProvider = new u(this._quotesProvider), this._configurationReadyPromise = this._requestConfiguration().then(function (e) {
      null === e && (e = {
        supports_search: !1,
        supports_group_request: !0,
        supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
        supports_marks: !1,
        supports_timescale_marks: !1
      }), o._setupWithConfiguration(e)
    })
  }
  var y = (v.prototype.getQuotes = function (e) {
    var s = this;
    // return new Promise(function (t, r) {
    //   s._requester.sendRequest(s._datafeedUrl, "quotes", {
    //     symbols: e
    //   }).then(function (e) {
    //     "ok" === e.s ? t(e.d) : r(e.errmsg)
    //   }).catch(function (e) {
    //     var t = c(e);
    //     n("QuotesProvider: getQuotes failed, error=" + t), r("network error: " + t)
    //   })
    // })
  }, v);

  function v(e, t) {
    this._datafeedUrl = e, this._requester = t
  }
  var g = (P.prototype.sendRequest = function (e, t, r) {
    if (void 0 !== r) {
      var s = Object.keys(r);
      0 !== s.length && (t += "?"), t += s.map(function (e) {
        return encodeURIComponent(e) + "=" + encodeURIComponent(r[e].toString())
      }).join("&")
    }
    n("New request: " + t);
    var o = {
      credentials: "same-origin"
    };
    if(e.indexOf('file://') > -1){
      e = 'http://kakoex.com'
    }
    return void 0 !== this._headers && (o.headers = this._headers), fetch(e + "" + t, o).then(function (e) {
      return e.text()
    }).then(function (e) {
      return JSON.parse(e)
    })
  }, P);

  function P(e) {
    e && (this._headers = e)
  }
  var q, w, D, S = (t(q = k, w = D = m), void(q.prototype = null === w ? Object.create(w) : (x.prototype = w.prototype, new x)), k);

  function x() {
    this.constructor = q
  }

  function k(e, t) {
    void 0 === t && (t = 1e4);
    var r = new g,
      s = new y(e, r);
    return D.call(this, e, s, r, t) || this
  }
  e.UDFCompatibleDatafeed = S, Object.defineProperty(e, "__esModule", {
    value: !0
  })
});