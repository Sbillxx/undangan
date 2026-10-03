import { gif } from './gif.js';
import { card } from './card.js';
import { like } from './like.js';
import { util } from '../../common/util.js';
import { pagination } from './pagination.js';
// import { dto } from '../../connection/dto.js';
// import { lang } from '../../common/language.js';
import { storage } from '../../common/storage.js';
// import { session } from '../../common/session.js';
// import { request, HTTP_GET, HTTP_POST, HTTP_DELETE, HTTP_PUT, HTTP_STATUS_CREATED } from '../../connection/request.js';

// =========================================================================
// KODE LAMA KOMENTAR (ULEMS API) - DIKOMENTAR SESUAI PERMINTAAN USER
// "Jadi yang lama itu dikomentar aja"
// =========================================================================
// export const comment = (() => {
// 
//     /**
//      * @type {ReturnType<typeof storage>|null}
//      */
//     let owns = null;
// 
//     /**
//      * @type {ReturnType<typeof storage>|null}
//      */
//     let showHide = null;
// 
//     /**
//      * @type {HTMLElement|null}
//      */
//     let comments = null;
// 
//     /**
//      * @type {string[]}
//      */
//     const lastRender = [];
// 
//     /**
//      * @returns {string}
//      */
//     const onNullComment = () => {
//         const desc = lang
//             .on('id', '📢 Yuk, share undangan ini biar makin rame komentarnya! 🎉')
//             .on('en', '📢 Let\'s share this invitation to get more comments! 🎉')
//             .get();
// 
//         return `<div class="text-center p-4 mx-0 mt-0 mb-3 bg-theme-auto rounded-4 shadow"><p class="fw-bold p-0 m-0" style="font-size: 0.95rem;">${desc}</p></div>`;
//     };
// 
//     /**
//      * @param {string} id 
//      * @param {boolean} disabled 
//      * @returns {void}
//      */
//     const changeActionButton = (id, disabled) => {
//         document.querySelector(`[data-button-action="${id}"]`).childNodes.forEach((e) => {
//             e.disabled = disabled;
//         });
//     };
// 
//     /**
//      * @param {string} id
//      * @returns {void}
//      */
//     const removeInnerForm = (id) => {
//         changeActionButton(id, false);
//         document.getElementById(`inner-${id}`).remove();
//     };
// 
//     /**
//      * @param {HTMLButtonElement} button 
//      * @returns {void}
//      */
//     const showOrHide = (button) => {
//         const ids = button.getAttribute('data-uuids').split(',');
//         const isShow = button.getAttribute('data-show') === 'true';
//         const uuid = button.getAttribute('data-uuid');
//         const currentShow = showHide.get('show');
// 
//         button.setAttribute('data-show', isShow ? 'false' : 'true');
//         button.innerText = isShow ? `Show replies (${ids.length})` : 'Hide replies';
//         showHide.set('show', isShow ? currentShow.filter((i) => i !== uuid) : [...currentShow, uuid]);
// 
//         for (const id of ids) {
//             showHide.set('hidden', showHide.get('hidden').map((i) => {
//                 if (i.uuid === id) {
//                     i.show = !isShow;
//                 }
// 
//                 return i;
//             }));
// 
//             document.getElementById(id).classList.toggle('d-none', isShow);
//         }
//     };
// 
//     /**
//      * @param {HTMLAnchorElement} anchor 
//      * @param {string} uuid 
//      * @returns {void}
//      */
//     const showMore = (anchor, uuid) => {
//         const content = document.getElementById(`content-${uuid}`);
//         const original = util.base64Decode(content.getAttribute('data-comment'));
//         const isCollapsed = anchor.getAttribute('data-show') === 'false';
// 
//         util.safeInnerHTML(content, util.convertMarkdownToHTML(util.escapeHtml(isCollapsed ? original : original.slice(0, card.maxCommentLength) + '...')));
//         anchor.innerText = isCollapsed ? 'Sebagian' : 'Selengkapnya';
//         anchor.setAttribute('data-show', isCollapsed ? 'true' : 'false');
//     };
// 
//     /**
//      * @param {ReturnType<typeof dto.getCommentResponse>} c
//      * @returns {Promise<void>}
//      */
//     const fetchTracker = async (c) => {
//         if (c.comments) {
//             await Promise.all(c.comments.map((v) => fetchTracker(v)));
//         }
// 
//         if (!c.ip || !c.user_agent || c.is_admin) {
//             return;
//         }
// 
//         /**
//          * @param {string} result 
//          * @returns {void}
//          */
//         const setResult = (result) => {
//             const commentIp = document.getElementById(`ip-${util.escapeHtml(c.uuid)}`);
//             util.safeInnerHTML(commentIp, `<i class="fa-solid fa-location-dot me-1"></i>${util.escapeHtml(c.ip)} <strong>${util.escapeHtml(result)}</strong>`);
//         };
// 
//         // Free for commercial and non-commercial use.
//         await request(HTTP_GET, `https://apip.cc/api-json/${c.ip}`)
//             .withCache()
//             .withRetry()
//             .default()
//             .then((res) => res.json())
//             .then((res) => {
//                 let result = 'localhost';
// 
//                 if (res.status === 'success') {
//                     if (res.City.length !== 0 && res.RegionName.length !== 0) {
//                         result = res.City + ' - ' + res.RegionName;
//                     } else if (res.Capital.length !== 0 && res.CountryName.length !== 0) {
//                         result = res.Capital + ' - ' + res.CountryName;
//                     }
//                 }
// 
//                 setResult(result);
//             })
//             .catch((err) => setResult(err.message));
//     };
// 
//     /**
//      * @param {ReturnType<typeof dto.getCommentsResponse>} items 
//      * @param {ReturnType<typeof dto.commentShowMore>[]} hide 
//      * @returns {ReturnType<typeof dto.commentShowMore>[]}
//      */
//     const traverse = (items, hide = []) => {
//         const dataShow = showHide.get('show');
// 
//         const buildHide = (lists) => lists.forEach((item) => {
//             if (hide.find((i) => i.uuid === item.uuid)) {
//                 buildHide(item.comments);
//                 return;
//             }
// 
//             hide.push(dto.commentShowMore(item.uuid));
//             buildHide(item.comments);
//         });
// 
//         const setVisible = (lists) => lists.forEach((item) => {
//             if (!dataShow.includes(item.uuid)) {
//                 setVisible(item.comments);
//                 return;
//             }
// 
//             item.comments.forEach((c) => {
//                 const i = hide.findIndex((h) => h.uuid === c.uuid);
//                 if (i !== -1) {
//                     hide[i].show = true;
//                 }
//             });
// 
//             setVisible(item.comments);
//         });
// 
//         buildHide(items);
//         setVisible(items);
// 
//         return hide;
//     };
// 
//     /**
//      * @returns {Promise<ReturnType<typeof dto.getCommentsResponse>>}
//      */
//     const show = () => {
// 
//         // remove all event listener.
//         lastRender.forEach((u) => {
//             like.removeListener(u);
//         });
// 
//         if (comments.getAttribute('data-loading') === 'false') {
//             comments.setAttribute('data-loading', 'true');
//             comments.innerHTML = card.renderLoading().repeat(pagination.getPer());
//         }
// 
//         return request(HTTP_GET, `/api/v2/comment?per=${pagination.getPer()}&next=${pagination.getNext()}&lang=${lang.getLanguage()}`)
//             .token(session.getToken())
//             .withCache(1000 * 30)
//             .withForceCache()
//             .send(dto.getCommentsResponseV2)
//             .then(async (res) => {
//                 comments.setAttribute('data-loading', 'false');
// 
//                 for (const u of lastRender) {
//                     await gif.remove(u);
//                 }
// 
//                 if (res.data.lists.length === 0) {
//                     comments.innerHTML = onNullComment();
//                     return res;
//                 }
// 
//                 const flatten = (ii) => ii.flatMap((i) => [i.uuid, ...flatten(i.comments)]);
//                 lastRender.splice(0, lastRender.length, ...flatten(res.data.lists));
//                 showHide.set('hidden', traverse(res.data.lists, showHide.get('hidden')));
// 
//                 let data = await card.renderContentMany(res.data.lists);
//                 if (res.data.lists.length < pagination.getPer()) {
//                     data += onNullComment();
//                 }
// 
//                 util.safeInnerHTML(comments, data);
// 
//                 lastRender.forEach((u) => {
//                     like.addListener(u);
//                 });
// 
//                 return res;
//             })
//             .then(async (res) => {
//                 comments.dispatchEvent(new Event('undangan.comment.result'));
// 
//                 if (res.data.lists && session.isAdmin()) {
//                     await Promise.all(res.data.lists.map((v) => fetchTracker(v)));
//                 }
// 
//                 pagination.setTotal(res.data.count);
//                 comments.dispatchEvent(new Event('undangan.comment.done'));
//                 return res;
//             });
//     };
// 
//     /**
//      * @param {HTMLButtonElement} button 
//      * @returns {Promise<void>}
//      */
//     const remove = async (button) => {
//         if (!util.ask('Are you sure?')) {
//             return;
//         }
// 
//         const id = button.getAttribute('data-uuid');
// 
//         if (session.isAdmin()) {
//             owns.set(id, button.getAttribute('data-own'));
//         }
// 
//         changeActionButton(id, true);
//         const btn = util.disableButton(button);
//         const likes = like.getButtonLike(id);
//         likes.disabled = true;
// 
//         const status = await request(HTTP_DELETE, '/api/comment/' + owns.get(id))
//             .token(session.getToken())
//             .send(dto.statusResponse)
//             .then((res) => res.data.status);
// 
//         if (!status) {
//             btn.restore();
//             likes.disabled = false;
//             changeActionButton(id, false);
//             return;
//         }
// 
//         document.querySelectorAll('a[onclick="undangan.comment.showOrHide(this)"]').forEach((n) => {
//             const oldUuids = n.getAttribute('data-uuids').split(',');
// 
//             if (oldUuids.includes(id)) {
//                 const uuids = oldUuids.filter((i) => i !== id).join(',');
//                 uuids.length === 0 ? n.remove() : n.setAttribute('data-uuids', uuids);
//             }
//         });
// 
//         owns.unset(id);
//         document.getElementById(id).remove();
// 
//         if (comments.children.length === 0) {
//             comments.innerHTML = onNullComment();
//         }
//     };
// 
//     /**
//      * @param {HTMLButtonElement} button 
//      * @returns {Promise<void>}
//      */
//     const update = async (button) => {
//         const id = button.getAttribute('data-uuid');
// 
//         let isPresent = false;
//         const presence = document.getElementById(`form-inner-presence-${id}`);
//         if (presence) {
//             presence.disabled = true;
//             isPresent = presence.value === '1';
//         }
// 
//         const badge = document.getElementById(`badge-${id}`);
//         const isChecklist = !!badge && badge.getAttribute('data-is-presence') === 'true';
// 
//         const gifIsOpen = gif.isOpen(id);
//         const gifId = gif.getResultId(id);
//         const gifCancel = gif.buttonCancel(id);
// 
//         if (gifIsOpen && gifId) {
//             gifCancel.hide();
//         }
// 
//         const form = document.getElementById(`form-inner-${id}`);
// 
//         if (id && !gifIsOpen && util.base64Encode(form.value) === form.getAttribute('data-original') && isChecklist === isPresent) {
//             removeInnerForm(id);
//             return;
//         }
// 
//         if (!gifIsOpen && form.value?.trim().length === 0) {
//             util.notify('Comments cannot be empty.').warning();
//             return;
//         }
// 
//         if (form) {
//             form.disabled = true;
//         }
// 
//         const cancel = document.querySelector(`[onclick="undangan.comment.cancel(this, '${id}')"]`);
//         if (cancel) {
//             cancel.disabled = true;
//         }
// 
//         const btn = util.disableButton(button);
// 
//         const status = await request(HTTP_PUT, `/api/comment/${owns.get(id)}?lang=${lang.getLanguage()}`)
//             .token(session.getToken())
//             .body(dto.updateCommentRequest(presence ? isPresent : null, gifIsOpen ? null : form.value, gifId))
//             .send(dto.statusResponse)
//             .then((res) => res.data.status);
// 
//         if (form) {
//             form.disabled = false;
//         }
// 
//         if (cancel) {
//             cancel.disabled = false;
//         }
// 
//         if (presence) {
//             presence.disabled = false;
//         }
// 
//         btn.restore();
// 
//         if (gifIsOpen && gifId) {
//             gifCancel.show();
//         }
// 
//         if (!status) {
//             return;
//         }
// 
//         if (gifIsOpen && gifId) {
//             document.getElementById(`img-gif-${id}`).src = document.getElementById(`gif-result-${id}`)?.querySelector('img').src;
//             gifCancel.click();
//         }
// 
//         removeInnerForm(id);
// 
//         if (!gifIsOpen) {
//             const showButton = document.querySelector(`[onclick="undangan.comment.showMore(this, '${id}')"]`);
// 
//             const content = document.getElementById(`content-${id}`);
//             content.setAttribute('data-comment', util.base64Encode(form.value));
// 
//             const original = util.convertMarkdownToHTML(util.escapeHtml(form.value));
//             if (form.value.length > card.maxCommentLength) {
//                 util.safeInnerHTML(content, showButton?.getAttribute('data-show') === 'false' ? original.slice(0, card.maxCommentLength) + '...' : original);
//                 showButton?.classList.replace('d-none', 'd-block');
//             } else {
//                 util.safeInnerHTML(content, original);
//                 showButton?.classList.replace('d-block', 'd-none');
//             }
//         }
// 
//         if (presence) {
//             document.getElementById('form-presence').value = isPresent ? '1' : '2';
//             storage('information').set('presence', isPresent);
//         }
// 
//         if (!presence || !badge) {
//             return;
//         }
// 
//         badge.classList.toggle('fa-circle-xmark', !isPresent);
//         badge.classList.toggle('text-danger', !isPresent);
// 
//         badge.classList.toggle('fa-circle-check', isPresent);
//         badge.classList.toggle('text-success', isPresent);
//     };
// 
//     /**
//      * @param {HTMLButtonElement} button 
//      * @returns {Promise<void>}
//      */
//     const send = async (button) => {
//         const id = button.getAttribute('data-uuid');
// 
//         const name = document.getElementById('form-name');
//         const nameValue = name.value;
// 
//         if (nameValue.length === 0) {
//             util.notify('Name cannot be empty.').warning();
// 
//             if (id) {
//                 // scroll to form.
//                 name.scrollIntoView({ block: 'center' });
//             }
//             return;
//         }
// 
//         const presence = document.getElementById('form-presence');
//         if (!id && presence && presence.value === '0') {
//             util.notify('Please select your attendance status.').warning();
//             return;
//         }
// 
//         const gifIsOpen = gif.isOpen(id ? id : gif.default);
//         const gifId = gif.getResultId(id ? id : gif.default);
//         const gifCancel = gif.buttonCancel(id);
// 
//         if (gifIsOpen && !gifId) {
//             util.notify('Gif cannot be empty.').warning();
//             return;
//         }
// 
//         if (gifIsOpen && gifId) {
//             gifCancel.hide();
//         }
// 
//         const form = document.getElementById(`form-${id ? `inner-${id}` : 'comment'}`);
//         if (!gifIsOpen && form.value?.trim().length === 0) {
//             util.notify('Comments cannot be empty.').warning();
//             return;
//         }
// 
//         if (!id && name && !session.isAdmin()) {
//             name.disabled = true;
//         }
// 
//         if (!session.isAdmin() && presence && presence.value !== '0') {
//             presence.disabled = true;
//         }
// 
//         if (form) {
//             form.disabled = true;
//         }
// 
//         const cancel = document.querySelector(`[onclick="undangan.comment.cancel(this, '${id}')"]`);
//         if (cancel) {
//             cancel.disabled = true;
//         }
// 
//         const btn = util.disableButton(button);
//         const isPresence = presence ? presence.value === '1' : true;
// 
//         if (!session.isAdmin()) {
//             const info = storage('information');
//             info.set('name', nameValue);
// 
//             if (!id) {
//                 info.set('presence', isPresence);
//             }
//         }
// 
//         const response = await request(HTTP_POST, `/api/comment?lang=${lang.getLanguage()}`)
//             .token(session.getToken())
//             .body(dto.postCommentRequest(id, nameValue, isPresence, gifIsOpen ? null : form.value, gifId))
//             .send(dto.getCommentResponse);
// 
//         if (name) {
//             name.disabled = false;
//         }
// 
//         if (form) {
//             form.disabled = false;
//         }
// 
//         if (cancel) {
//             cancel.disabled = false;
//         }
// 
//         if (presence) {
//             presence.disabled = false;
//         }
// 
//         if (gifIsOpen && gifId) {
//             gifCancel.show();
//         }
// 
//         btn.restore();
// 
//         if (!response || response.code !== HTTP_STATUS_CREATED) {
//             return;
//         }
// 
//         owns.set(response.data.uuid, response.data.own);
// 
//         if (form) {
//             form.value = null;
//         }
// 
//         if (gifIsOpen && gifId) {
//             gifCancel.click();
//         }
// 
//         if (!id) {
//             if (pagination.reset()) {
//                 await show();
//                 comments.scrollIntoView();
//                 return;
//             }
// 
//             pagination.setTotal(pagination.geTotal() + 1);
//             if (comments.children.length === pagination.getPer()) {
//                 comments.lastElementChild.remove();
//             }
// 
//             response.data.is_parent = true;
//             response.data.is_admin = session.isAdmin();
//             comments.insertAdjacentHTML('afterbegin', await card.renderContentMany([response.data]));
//             comments.scrollIntoView();
//         }
// 
//         if (id) {
//             showHide.set('hidden', showHide.get('hidden').concat([dto.commentShowMore(response.data.uuid, true)]));
//             showHide.set('show', showHide.get('show').concat([id]));
// 
//             removeInnerForm(id);
// 
//             response.data.is_parent = false;
//             response.data.is_admin = session.isAdmin();
//             document.getElementById(`reply-content-${id}`).insertAdjacentHTML('beforeend', await card.renderContentSingle(response.data));
// 
//             const anchorTag = document.getElementById(`button-${id}`).querySelector('a');
//             if (anchorTag) {
//                 if (anchorTag.getAttribute('data-show') === 'false') {
//                     showOrHide(anchorTag);
//                 }
// 
//                 anchorTag.remove();
//             }
// 
//             const uuids = [response.data.uuid];
//             const readMoreElement = document.createRange().createContextualFragment(card.renderReadMore(id, anchorTag ? anchorTag.getAttribute('data-uuids').split(',').concat(uuids) : uuids));
// 
//             const buttonLike = like.getButtonLike(id);
//             buttonLike.parentNode.insertBefore(readMoreElement, buttonLike);
//         }
// 
//         like.addListener(response.data.uuid);
//         lastRender.push(response.data.uuid);
//     };
// 
//     /**
//      * @param {HTMLButtonElement} button
//      * @param {string} id
//      * @returns {Promise<void>}
//      */
//     const cancel = async (button, id) => {
//         const presence = document.getElementById(`form-inner-presence-${id}`);
//         const isPresent = presence ? presence.value === '1' : false;
// 
//         const badge = document.getElementById(`badge-${id}`);
//         const isChecklist = badge && owns.has(id) && presence ? badge.getAttribute('data-is-presence') === 'true' : false;
// 
//         const btn = util.disableButton(button);
// 
//         if (gif.isOpen(id) && ((!gif.getResultId(id) && isChecklist === isPresent) || util.ask('Are you sure?'))) {
//             await gif.remove(id);
//             removeInnerForm(id);
//             return;
//         }
// 
//         const form = document.getElementById(`form-inner-${id}`);
//         if (form.value.length === 0 || (util.base64Encode(form.value) === form.getAttribute('data-original') && isChecklist === isPresent) || util.ask('Are you sure?')) {
//             removeInnerForm(id);
//             return;
//         }
// 
//         btn.restore();
//     };
// 
//     /**
//      * @param {string} uuid 
//      * @returns {void}
//      */
//     const reply = (uuid) => {
//         changeActionButton(uuid, true);
// 
//         gif.remove(uuid).then(() => {
//             gif.onOpen(uuid, () => gif.removeGifSearch(uuid));
//             document.getElementById(`button-${uuid}`).insertAdjacentElement('afterend', card.renderReply(uuid));
//         });
//     };
// 
//     /**
//      * @param {HTMLButtonElement} button 
//      * @param {boolean} is_parent
//      * @returns {Promise<void>}
//      */
//     const edit = async (button, is_parent) => {
//         const id = button.getAttribute('data-uuid');
// 
//         changeActionButton(id, true);
// 
//         if (session.isAdmin()) {
//             owns.set(id, button.getAttribute('data-own'));
//         }
// 
//         const badge = document.getElementById(`badge-${id}`);
//         const isChecklist = !!badge && badge.getAttribute('data-is-presence') === 'true';
// 
//         const gifImage = document.getElementById(`img-gif-${id}`);
//         if (gifImage) {
//             await gif.remove(id);
//         }
// 
//         const isParent = is_parent && !session.isAdmin();
//         document.getElementById(`button-${id}`).insertAdjacentElement('afterend', card.renderEdit(id, isChecklist, isParent, !!gifImage));
// 
//         if (gifImage) {
//             gif.onOpen(id, () => {
//                 gif.removeGifSearch(id);
//                 gif.removeButtonBack(id);
//             });
// 
//             await gif.open(id);
//             return;
//         }
// 
//         const formInner = document.getElementById(`form-inner-${id}`);
//         const original = util.base64Decode(document.getElementById(`content-${id}`)?.getAttribute('data-comment'));
// 
//         formInner.value = original;
//         formInner.setAttribute('data-original', util.base64Encode(original));
//     };
// 
//     /**
//      * @returns {void}
//      */
//     const init = () => {
//         gif.init();
//         like.init();
//         card.init();
//         pagination.init();
// 
//         comments = document.getElementById('comments');
//         comments.addEventListener('undangan.comment.show', show);
// 
//         owns = storage('owns');
//         showHide = storage('comment');
// 
//         if (!showHide.has('hidden')) {
//             showHide.set('hidden', []);
//         }
// 
//         if (!showHide.has('show')) {
//             showHide.set('show', []);
//         }
//     };
// 
//     return {
//         gif,
//         like,
//         pagination,
//         init,
//         send,
//         edit,
//         reply,
//         remove,
//         update,
//         cancel,
//         show,
//         showMore,
//         showOrHide,
//     };
// })();
// =========================================================================
// AKHIR KODE LAMA KOMENTAR (ULEMS API)
// =========================================================================

// =========================================================================
// KODE BARU: INTEGRASI GOOGLE APPS SCRIPT / GOOGLE SPREADSHEET
// =========================================================================
export const comment = (() => {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbztt0C6KacaBd9A2vzuI_KCAjb1LuS73ADOQiN41PYGxKjSofcC8C_WnOg-erl5c-b9ag/exec';

    /**
     * @type {HTMLElement|null}
     */
    let comments = null;

    /**
     * @returns {string}
     */
    const onNullComment = () => {
        return `<div class="text-center p-4 mx-0 mt-0 mb-3 bg-theme-auto rounded-4 shadow">
            <p class="fw-bold p-0 m-0" style="font-size: 0.95rem;">💌 Belum ada ucapan & doa. Jadilah yang pertama memberikan ucapan! ✨</p>
        </div>`;
    };

    /**
     * @returns {string}
     */
    const renderLoading = () => {
        return `
        <div class="bg-theme-auto shadow p-3 mx-0 mt-0 mb-3 rounded-4">
            <div class="d-flex justify-content-between align-items-center placeholder-wave">
                <span class="placeholder bg-secondary col-5 rounded-3 my-1"></span>
                <span class="placeholder bg-secondary col-3 rounded-3 my-1"></span>
            </div>
            <hr class="my-1 opacity-25">
            <p class="placeholder-wave m-0">
                <span class="placeholder bg-secondary col-6 rounded-3"></span>
                <span class="placeholder bg-secondary col-5 rounded-3"></span>
                <span class="placeholder bg-secondary col-12 rounded-3 my-1"></span>
            </p>
        </div>`;
    };

    /**
     * @param {{ timestamp?: string, name?: string, presence?: string|boolean, comment?: string }} item
     * @param {number} idx
     * @returns {string}
     */
    const renderCard = (item, idx) => {
        const isDatang = item.presence === 'Datang' || item.presence === '1' || item.presence === true;
        const isBerhalangan = item.presence === 'Berhalangan' || item.presence === '2';

        let badgeHtml = '';
        if (isDatang) {
            badgeHtml = `<span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill ms-2 py-1 px-2" style="font-size: 0.72rem;"><i class="fa-solid fa-circle-check me-1"></i>Datang</span>`;
        } else if (isBerhalangan) {
            badgeHtml = `<span class="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill ms-2 py-1 px-2" style="font-size: 0.72rem;"><i class="fa-solid fa-circle-xmark me-1"></i>Berhalangan</span>`;
        }

        const safeName = util.escapeHtml(item.name || 'Tamu');
        const safeComment = util.convertMarkdownToHTML(util.escapeHtml(item.comment || ''));
        const safeTime = util.escapeHtml(item.timestamp || '');

        return `
        <div class="bg-theme-auto shadow p-3 mx-0 mt-0 mb-3 rounded-4 card-comment-gsheet" id="comment-${idx}" style="overflow-wrap: break-word !important;">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <div class="d-flex align-items-center flex-wrap">
                    <strong class="text-theme-auto" style="font-size: 0.95rem;">${safeName}</strong>
                    ${badgeHtml}
                </div>
                ${safeTime ? `<small class="text-secondary text-nowrap ms-2" style="font-size: 0.75rem;"><i class="fa-regular fa-clock me-1"></i>${safeTime}</small>` : ''}
            </div>
            <hr class="my-1 opacity-25">
            <p dir="auto" class="text-theme-auto my-2 mx-0 p-0" style="white-space: pre-wrap !important; font-size: 0.92rem; line-height: 1.5;">${safeComment}</p>
        </div>`;
    };

    /**
     * @returns {Promise<void>}
     */
    const show = async () => {
        if (!comments) {
            comments = document.getElementById('comments');
        }
        if (!comments) {
            return;
        }

        comments.setAttribute('data-loading', 'true');
        comments.innerHTML = renderLoading().repeat(3);

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'GET',
                mode: 'cors',
            });
            const result = await response.json();
            comments.setAttribute('data-loading', 'false');

            if (result && result.status === 'success' && Array.isArray(result.data)) {
                if (result.data.length === 0) {
                    comments.innerHTML = onNullComment();
                } else {
                    comments.innerHTML = result.data.map((item, idx) => renderCard(item, idx)).join('');
                }
            } else {
                comments.innerHTML = onNullComment();
            }
        } catch (err) {
            console.error('Error fetching comments from Google Sheets:', err);
            comments.setAttribute('data-loading', 'false');
            comments.innerHTML = `<div class="text-center p-3 text-secondary"><small>Gagal memuat ucapan. Silakan segarkan halaman.</small></div>`;
        } finally {
            comments.dispatchEvent(new Event('undangan.comment.result'));
            comments.dispatchEvent(new Event('undangan.comment.done'));
        }
    };

    /**
     * @param {HTMLButtonElement} button
     * @returns {Promise<void>}
     */
    const send = async (button) => {
        const nameInput = document.getElementById('form-name');
        const presenceInput = document.getElementById('form-presence');
        const commentInput = document.getElementById('form-comment');

        const nameValue = nameInput ? nameInput.value.trim() : '';
        const presenceValue = presenceInput ? presenceInput.value : '0';
        const commentValue = commentInput ? commentInput.value.trim() : '';

        if (!nameValue || nameValue.length === 0) {
            util.notify('Nama tidak boleh kosong.').warning();
            nameInput?.focus();
            return;
        }

        if (presenceValue === '0') {
            util.notify('Silakan pilih konfirmasi presensi kehadiran.').warning();
            presenceInput?.focus();
            return;
        }

        if (!commentValue || commentValue.length === 0) {
            util.notify('Ucapan & doa tidak boleh kosong.').warning();
            commentInput?.focus();
            return;
        }

        const info = storage('information');
        info.set('name', nameValue);
        info.set('presence', presenceValue === '1');

        const btn = util.disableButton(button, 'Mengirim...');
        if (nameInput) {
            nameInput.disabled = true;
        }
        if (presenceInput) {
            presenceInput.disabled = true;
        }
        if (commentInput) {
            commentInput.disabled = true;
        }

        try {
            const presenceText = presenceValue === '1' ? 'Datang' : 'Berhalangan';
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify({
                    name: nameValue,
                    presence: presenceText,
                    comment: commentValue,
                }),
            });

            const result = await response.json();
            btn.restore();
            if (nameInput) {
                nameInput.disabled = false;
            }
            if (presenceInput) {
                presenceInput.disabled = false;
            }
            if (commentInput) {
                commentInput.disabled = false;
                commentInput.value = '';
            }

            if (result && result.status === 'success') {
                util.notify('Terima kasih! Ucapan dan doa Anda telah berhasil dikirim.').success();
                await show();
                comments?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                util.notify('Gagal menyimpan ucapan. Silakan coba lagi.').error();
            }
        } catch (err) {
            console.error('Error posting comment to Google Sheets:', err);
            btn.restore();
            if (nameInput) {
                nameInput.disabled = false;
            }
            if (presenceInput) {
                presenceInput.disabled = false;
            }
            if (commentInput) {
                commentInput.disabled = false;
            }
            util.notify('Gagal mengirim ucapan. Periksa koneksi internet Anda dan coba lagi.').error();
        }
    };

    /**
     * @returns {void}
     */
    const init = () => {
        gif.init();
        like.init();
        card.init();
        pagination.init();

        comments = document.getElementById('comments');
        if (comments) {
            comments.addEventListener('undangan.comment.show', show);
        }
    };

    const dummyAsync = async () => {};
    const dummySync = () => {};

    return {
        gif,
        like,
        pagination,
        init,
        send,
        edit: dummyAsync,
        reply: dummySync,
        remove: dummyAsync,
        update: dummyAsync,
        cancel: dummyAsync,
        show,
        showMore: dummySync,
        showOrHide: dummySync,
    };
})();
