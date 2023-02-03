import {
  screen,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
  dialog,
  session,
} from 'electron';
import fetch from "node-fetch";
import Store from 'electron-store';
import FormData from 'form-data';

const cheerio = require('cheerio');
const axios = require('axios');

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
      webviewTag: true,
      ...options.webPreferences,
    },
  };
  win = new BrowserWindow(browserOptions);
  win.removeMenu()

  let win2;
  win2 = new BrowserWindow({
    parent: win,
    show:false,
  });
  win2.removeMenu()

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
      session.defaultSession.cookies.set({
        url : "url", // 기본적으로 입력 해주어야함
        name : "name",
        value : cookie,
        httpOnly : true, // client에서 쿠키를 접근함을 방지하기위해 설정 ( 보안 설정 )
      })
        .then(() => {
          // success
        }, (error) => {
          console.error(error)
        })

      event.reply('login', data)
    })
  })

  ipcMain.on('homework_proc', (event, arg) => {
    console.log(arg)
    const { content, file1, cookie, cpc_cid, cpc_no, idx, homework_idx } = arg

    const fetchCall = async () => {
      let formData = new FormData();
      formData.append('content', content);
      formData.append('file1', file1[0]);
      formData.append('cpc_cid', cpc_cid);
      formData.append('cpc_no', cpc_no);
      formData.append('idx', idx);
      formData.append('homework_idx', homework_idx);

      console.log('formData', formData)

      const url = `https://sungsan.silverhug.co.kr/cpcenter/mypage/homework_proc.php?`;
      const result = await axios({
        url: url,
        method: 'POST',
        headers: {
          Cookie: `PHPSESSID=${cookie}`,
        },
        cache: 'no-cache',
        data: formData,
        body: `content=${content}&bbb=b1`,
      })
        .then(async res => {
          console.log('res',res)
          return await res.data;
        })
      return result;
    }

    fetchCall().then(data => {
      event.reply('homework_proc', data)
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
    let url = ''
    const fetchCall = async () => {
      url = `https://sungsan.silverhug.co.kr/cpcenter/mypage/mysc.php?yy=${year}&mm=${month}&dd=${date.toString().padStart(2,"0")}`;
      console.log('url', url);
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

    fetchCall().then(async data => {
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

      const list2 = $('#spcontent_wrap > div.myschedule_in > table:nth-child(5) > tbody > tr').map((i, element) => {
        let tr = { No: '', 제출기간: '', 프로그램: '', 담당: '', 유형: '', 미션제목: '', 제출여부: '', 미션평가:'', id: 0};
        tr.id = i+1
        tr.No = String($(element).find('td:nth-child(1)').text())
        tr.제출기간 = String($(element).find('td:nth-of-type(2)').text())
        tr.프로그램 = String($(element).find('td:nth-of-type(3)').text())
        tr.담당 = String($(element).find('td:nth-of-type(4)').text())
        tr.유형 = String($(element).find('td:nth-of-type(5)').text())
        tr.미션제목 = String($(element).find('td:nth-of-type(6)').text())
        tr.제출여부 = String($(element).find('td:nth-of-type(7)').text())
        tr.미션평가 = $(element).find('td:nth-of-type(8) > a').attr('href');
        return tr;
      })
      event.reply('today2', list2);

      const list3 = await $('#spcontent_wrap > div.myschedule_in > table:nth-child(8) > tbody > tr').map(async (i, element) => {
        let tr = { 번호: '', 미션: '', 미션기한: '', 작성자: '', 미션수행확인: '', id: 0, web: '', video: '' };

        tr.id = i+1
        tr.번호 = String($(element).find('td:nth-child(1)').text())
        tr.미션 = String($(element).find('td:nth-of-type(2)').text())
        tr.미션기한 = String($(element).find('td:nth-of-type(3)').text())
        tr.작성자 = String($(element).find('td:nth-of-type(4)').text())
        tr.미션수행확인 = $(element).find('td:nth-of-type(5)').contents()
        const btn = $(element).find('td:nth-of-type(2) > span.button.pink.small').html().replaceAll('../vod/vod','https://sungsan.silverhug.co.kr/cpcenter/vod/vod');
        console.log('btn',btn)
        const url2 = btn.split('window.open(\'')[1].split('\',\'')[0];
        console.log('url2',url2)

        const videoAsync = async (_url) => {
          console.log('cookie',cookie)
          console.log('url',_url.replaceAll('amp;', ''))
          const result = await fetch(_url.replaceAll('amp;', ''), {
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

        const arg = await videoAsync(url2).then(data => {
          const $ = cheerio.load(data);
          console.log('cheerio')
          console.log('data',data)
          return $('body > div').html()
        });
        console.log('arg',arg)

        tr.video = arg;

        console.log('tr',tr)

        return tr;
      })

      Promise.all(
        list3
      ).then(data => {
        console.log('list3',data)
        event.reply('today3', data)
      }).catch((err)=>{
        console.log(err)
      });
    })
  })

  /**
   * 보더 상세
   */
  ipcMain.on('boardModal', (event, arg) => {
    const { href, cookie } = arg
    const fetchCall = async () => {
      const url = `https://sungsan.silverhug.co.kr/cpcenter/mypage/${href}`;
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

      event.reply('boardModal', {
        '구분': $('#tab_wrapper > form > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td:nth-child(2)').text(),
        '이름': $('#tab_wrapper > form > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td:nth-child(2)').text(),
        '첨부파일': $('#tab_wrapper > form > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(3) > td:nth-child(2)').text(),
        '과제': $('#tab_wrapper > form > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(4) > td:nth-child(2)').text(),
        'VOD': $('#tab_wrapper > form > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(5) > td:nth-child(2)').text(),
        '강사': $('#tab_wrapper > form > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(6) > td:nth-child(2)').text(),
        '제출기한': $('#tab_wrapper > form > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(7) > td:nth-child(2)').text(),
        '과제내용': $('#tab_wrapper > form > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(9) > td > table > tbody > tr > td > p').text(),
        content: $('#textarea').text(),
        file: $('#tab_wrapper > form > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(13) > td:nth-child(2)').text(),
        cpc_cid: $('#tab_wrapper > form > input[type=hidden]:nth-child(1)').text(),
        cpc_no: $('#tab_wrapper > form > input[type=hidden]:nth-child(2)').text(),
        idx: $('#tab_wrapper > form > input[type=hidden]:nth-child(3)').text(),
        homework_idx: $('#tab_wrapper > form > input[type=hidden]:nth-child(4)').text(),

      })
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
