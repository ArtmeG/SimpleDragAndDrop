const http = {
    get(url) {
        try {
            return fetch(url)
                .then(response => response.json());
        } catch (e) {
            console.log(e);
        }
    }
}

// UI
const albumsURL = 'https://jsonplaceholder.typicode.com/albums/',
    photosURL = '/photos',
    albumsData = document.querySelector('.albums'),
    photosContainer = document.querySelector('.photos-container'),
    photoContainer = document.querySelector('.photo-container');

let currPhoto = '';


// Events
window.addEventListener('load', getAlbumsData);
albumsData.addEventListener('click', onClickAlbumHandler);
photosContainer.addEventListener('mousedown', onMouseDownPhotoHandler);
photoContainer.addEventListener('dragover', onDragOverHandler);
photoContainer.addEventListener('drop', onDropHandler);

/**
 *  Drag over handler
 * @param e
 */
function onDragOverHandler(e) {
    e.preventDefault();
}

/**
 * Mouse down photo handler
 * @param target
 */
function onMouseDownPhotoHandler({target}) {
    if (target.closest('[data-id]')){
        currPhoto = target;
        target.addEventListener('dragstart', onDragStartHandler);
    }
}

/**
 * Drag start handler
 * @param e
 */
function onDragStartHandler(e) {
    e.dataTransfer.setData('id', e.target.dataset.id);
}

/**
 * Drop handler
 * @param e
 */
function onDropHandler(e) {
    let itemId = e.dataTransfer.getData('id');
    const curElem = photosContainer.querySelector(`[data-id="${itemId}"]`);
    const newElem = curElem.cloneNode(true);
    e.currentTarget.append(newElem);
    currPhoto.removeEventListener('dragstart', onDragStartHandler);
}

/**
 * Click album handler
 * @param target
 * @param currentTarget
 */
function onClickAlbumHandler({target, currentTarget}) {
    if (target === currentTarget) {
        return;
    }
    const albumId = target.closest('[data-id]').dataset.id;

    http.get(`${albumsURL}${albumId}${photosURL}`)
        .then(photos => renderPhotosData(photos))
        .catch(error => console.log(error));
}

/**
 * Render photos
 * @param photos
 */
function renderPhotosData(photos) {
    if (!photos) {
        return;
    }
    photosContainer.innerHTML = createPhotoFragment(photos);
}

/**
 * Create photo fragment
 * @param photos
 * @returns {*}
 */
function createPhotoFragment(photos) {
    return photos.reduce((acc, photo) => {
        acc += createPhotoItem(photo);
        return acc;
    }, '');
}

/**
 * Create photo item
 * @param id
 * @param title
 * @param thumbnailUrl
 * @returns {string}
 */
function createPhotoItem({id, title, thumbnailUrl}) {
    return `
        <div class="thumbnail" data-id="${id}" draggable="true" tabindex="1" style="background-image: url('${thumbnailUrl}');">
            ${title}
        </div>
    `;
}

/**
 * Get albums
 */
function getAlbumsData() {
    http.get(`${albumsURL}`)
        .then(res => renderAlbumsData(res))
        .catch(error => console.log(error));
}

/**
 * Render albums data
 * @param albums
 */
function renderAlbumsData(albums) {
    if (!albums) {
        return
    }
    albumsData.innerHTML = createFragment(albums);
}

/**
 * Create album's fragment
 * @param albums
 * @returns {Object} albums fragments
 */
function createFragment(albums) {
    return albums.reduce((acc, album) => {
        acc += createAlbumItem(album);
        return acc;
    }, '');
}

/**
 * Create album fragment
 * @param id
 * @param title
 * @returns {string}
 */
function createAlbumItem({id, title}) {
    return `
        <li data-id=${id}>
            <p tabindex="1" >${title}</p>
        </li>
    `;
}