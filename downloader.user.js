// ==UserScript==
// @name         GitHub Classroom Assignments Downloader
// @version      1.0
// @description  Add some buttons to download assignment zip in GitHub classroom
// @author       rogeraabbccdd
// @match        https://classroom.github.com/*
// @namespace    https://github.com/rogeraabbccdd/GitHub-Assignments-Downloader/
// @updateURL    https://raw.githubusercontent.com/rogeraabbccdd/GitHub-Assignments-Downloader/master/downloader.user.js
// @downloadURL  https://raw.githubusercontent.com/rogeraabbccdd/GitHub-Assignments-Downloader/master/downloader.user.js
// @grant        none
// ==/UserScript==

const downloadBtnHTML = (url) => `
<a href="${url}/archive/master.zip" class="btn btn-sm BtnGroup-item btn-primary">
  <svg class="octicon octicon-download mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16"
    aria-hidden="true">
    <path fill-rule="evenodd"
      d="M7.47 10.78a.75.75 0 001.06 0l3.75-3.75a.75.75 0 00-1.06-1.06L8.75 8.44V1.75a.75.75 0 00-1.5 0v6.69L4.78 5.97a.75.75 0 00-1.06 1.06l3.75 3.75zM3.75 13a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z">
    </path>
  </svg>
  Download ZIP
</a>
`

const downloadAllBtnHTML =
  `<a id="js-download-all-btn" class="btn desktop-modal-btn assistant-modal-btn" aria-label="Download all repos in this page.">
    Download all repos ZIP in this page.
  </a>
`

const editDOM = async () => {
  const url = location.href

  const repos = []

  if (url.match(/classroom\.github\.com\/classrooms\/.*\/assignments\/.+/g)) {
    const timer = setInterval(() => {
      const loadings = document.querySelectorAll('#assignment-repo-list>include-fragment')
      if (loadings.length === 0) {
        clearInterval(timer)
        const BtnGroups = document.querySelectorAll('#assignment-repo-list>.assignment-repo-list-item>.BtnGroup')
        for (const BtnGroup of BtnGroups) {
          const url = BtnGroup.getElementsByTagName('a')[0].href
          repos.push(url)
          BtnGroup.insertAdjacentHTML('beforeend', downloadBtnHTML(url))
        }

        document.getElementById('js-modal-download-repos').insertAdjacentHTML('beforeend', downloadAllBtnHTML)

        const modalheight = parseInt(document.getElementsByClassName('assistant-modal-dropdown-menu')[0].style.height, 10)
        document.getElementsByClassName('assistant-modal-dropdown-menu')[0].style.height = (modalheight + 41) + 'px'

        const downloadAllBtn = document.getElementById('js-download-all-btn')
        downloadAllBtn.onclick = () => {
          let index = 0
          const downloadTimer = setInterval(() => {
            const a = document.createElement('a')
            a.href = repos[index] + '/archive/master.zip'
            a.download = ''
            a.target = '_blank'
            a.click()
            index++
            if (index === repos.length) {
              clearInterval(downloadTimer)
            }
          }, 300)
        }
      }
    }, 500)
  }
}

const observer = new MutationObserver(editDOM)

const container = document.documentElement || document.body
observer.observe(container, { attributes: true, childList: true, characterData: true })

editDOM()
