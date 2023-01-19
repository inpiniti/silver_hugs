import {
  screen,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
  dialog,
} from 'electron';
import fetch from "node-fetch";
import Store from 'electron-store';
const cheerio = require('cheerio');

export default (windowName: string, options: BrowserWindowConstructorOptions): BrowserWindow => {
  const key = 'window-state';
  const name = `window-state-${windowName}`;
  const store = new Store({ name });
  const defaultSize = {
    width: options.width,
    height: options.height,
  };
  let state = {};
  let win;

  const restore = () => store.get(key, defaultSize);

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };

  const ensureVisibleOnSomeDisplay = windowState => {
    const visible = screen.getAllDisplays().some(display => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = async (e) => {
    const choice = await dialog.showMessageBoxSync(this,
      {
        type: 'question',
        buttons: ['종료', '아니오'],
        title: '실버허그 종료',
        message: '"실버허그" 이용을 그만하겠습니까?'
    })

    if(choice == 1){
      e.preventDefault();
    } else {
      if (!win.isMinimized() && !win.isMaximized()) {
        Object.assign(state, getCurrentPosition());
      }
      store.set(key, state);
    }
  };

  state = ensureVisibleOnSomeDisplay(restore());

  const browserOptions: BrowserWindowConstructorOptions = {
    ...options,
    ...state,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      ...options.webPreferences,
    },
  };
  win = new BrowserWindow(browserOptions);
  win.removeMenu()

  win.on('close', saveState);

  ipcMain.on('login', (event, arg) => {
    const { id, pw, cookie } = arg
    const fetchCall = async () => {
      const url = `https://sungsan.silverhug.co.kr/cpcenter/member/login_proc.php?user_id=${id}&user_pass=${pw}&qry=in&s_url`;
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          Cookie: `PHPSESSID=${cookie}`,
        },
      })
        .then(async res => {
          return await res.text().then(res => res)
        })
      return result
    }

    fetchCall().then(data => {
      event.reply('login', data)
    })
  })

  /**
   * 오늘
   */
  ipcMain.on('board', (event, arg) => {
    const { cookie } = arg
    const fetchCall = async () => {
      const url = `https://sungsan.silverhug.co.kr/cpcenter/live/live_list.php`;
      const result = await fetch(url, {
        method: 'GET',
        headers: {
          Cookie: `PHPSESSID=${cookie}`,
        },
      })
      .then(async res => {
        return await res.text().then(res => res)
      })
      return result
    }

    fetchCall().then(data => {
      const $ = cheerio.load(data);
      let list = []
      $('#second-tab > table > tbody > tr').map((i, element) => {
        let tr = { 대상: '', 분야: '', 프로그램명: '', 강사명: '', id: 0, a: ''};
        tr.id = i+1
        tr.대상 = String($(element).find('td:nth-child(1) > p').text())
        tr.분야 = String($(element).find('td:nth-of-type(2)').text())
        tr.프로그램명 = String($(element).find('td:nth-of-type(3) > p > span').text())
        tr.강사명 = String($(element).find('td:nth-of-type(4)').text())
        tr.a = String($(element).find('td:nth-of-type(5) > a').attr('href'))
        return list.push(tr)
      })
      event.reply('board', list)
    })
  })

  /**
   * 오늘 해야할일
   */
  ipcMain.on('today', (event, arg) => {
    const today = new Date();
    const year = today.getFullYear(); // 년도
    const month = (today.getMonth() + 1).toString().padStart(2, '0');  // 월
    const date = today.getDate();  // 날짜

    const { cookie } = arg
    const fetchCall = async () => {
      const url = `https://sungsan.silverhug.co.kr/cpcenter/mypage/mysc.php?yy=${year}&mm=${month}&dd=${date}`;
      console.log('url', url)
      const result = await fetch(url, {
        method: 'GET',
        headers: {
          Cookie: `PHPSESSID=${cookie}`,
          Host: 'sungsan.silverhug.co.kr',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
        },
      })
        .then(async res => {
          return await res.text().then(res => res)
        })
      return result
    }

    fetchCall().then(data => {
      const $ = cheerio.load(data);
      const list = $('#spcontent_wrap > div.myschedule_in > table:nth-child(3) > tbody > tr').map((i, element) => {
        let tr = { 시간: '', program: '', 활동내용: '', liveType: '', id: 0, 강의실입장: ''};
        tr.id = i+1
        tr.시간 = String($(element).find('td:nth-child(1)').text()).split(' ~ ')[0]
        tr.program = String($(element).find('td:nth-of-type(2)').text())
        tr.활동내용 = String($(element).find('td:nth-of-type(3)').text())
        tr.liveType = String($(element).find('td:nth-of-type(4)').text())
        tr.강의실입장 = $(element).find('td:nth-of-type(5)').html()
        return tr
      })
      event.reply('today', list)
    })
  })

  /**
   * 인천 군청 공지사항
   */
  ipcMain.on('notice', (event) => {
    const fetchCall = async () => {
      const url = `https://www.ganghwa.go.kr/open_content/main/ganghwa/news/notice.jsp`;
      console.log('url', url)
      const result = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'PostmanRuntime/7.30.0',
          Accept: '*/*',
          'Postman-Token': '082a42cc-c979-4e64-b628-5b99da1c0e0b',
          Host: 'www.ganghwa.go.kr',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
        },
      })
        .then(async res => {
          return await res.text().then(res => res)
        })
      return result
    }

    fetchCall().then(data => {
      const $ = cheerio.load(data);
      const list = $('table.general_board tbody > tr').map((i, element) => {
        return {
          id: i+1,
          title: String($(element).find('td:nth-child(2)').text()),
          writer: String($(element).find('td:nth-child(4)').text()),
          date: String($(element).find('td:nth-child(5)').text()),
          num: String($(element).find('td:nth-child(6)').text()),
        };
      })
      event.reply('notice', list)
    })
  })

  /**
   * 채용정보
   */
  ipcMain.on('job', (event) => {
    const fetchCall = async () => {
      const url = `https://www.ganghwa.go.kr/open_content/main/part/job/recruit.jsp`;
      console.log('url', url)
      const result = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'PostmanRuntime/7.30.0',
          Accept: '*/*',
          'Postman-Token': '082a42cc-c979-4e64-b628-5b99da1c0e0b',
          Host: 'www.ganghwa.go.kr',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
        },
      })
        .then(async res => {
          return await res.text().then(res => res)
        })
      return result
    }

    fetchCall().then(data => {
      const $ = cheerio.load(data);
      const list = $('table.general_board tbody > tr').map((i, element) => {
        return {
          id: i+1,
          title: String($(element).find('td:nth-child(2)').text()),
          writer: String($(element).find('td:nth-child(4)').text()),
          date: String($(element).find('td:nth-child(5)').text()),
          num: String($(element).find('td:nth-child(6)').text()),
        };
      })
      event.reply('job', list)
    })
  })

  /**
   * 날씨
   */
  ipcMain.on('weather', (event) => {
    const fetchCall = async () => {
      const ipurl = 'https://api.ip.pe.kr/json/'
      const ip = await fetch(ipurl, {
        method: 'GET',
      }).then(async res => {
        return res.json()
      })

      console.log('ip', ip.ip)

      const 위도경도url = `https://api.ip2location.com/v2/
      ?ip=${ip.ip}
      &key=Q8FVAGT0LP
      &package=WS5
      &format=json
      &lang=ko`
      const 위도경도 = await fetch(위도경도url, {
        method: 'GET',
      }).then(async res => {
        return res.json()
      })

      const key = '5e117e54f72feb57a54b229b3c91f513'
      const lat = 위도경도.latitude
      const lon = 위도경도.longitude
      const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
      const result = await fetch(url, {
        method: 'GET',
        headers: {
          Host: 'api.openweathermap.org',
          Connection: 'keep-alive',
        }
      })
        .then(async res => {
          return await res.json()
        })
      return result
    }

    fetchCall().then(data => {
      event.reply('weather', JSON.parse(JSON.stringify(data)))
    })
  })
  return win;
};
