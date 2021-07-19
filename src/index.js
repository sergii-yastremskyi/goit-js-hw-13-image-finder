import './sass/main.scss';
import '@pnotify/core/dist/BrightTheme.css';
 import { error } from '@pnotify/core';
//   import * as PNotifyMobile from 'node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
  
const refs = {
    input: document.querySelector("#search-form > input[type=text]"),
    form: document.querySelector("#search-form"),
    loadMO: document.querySelector("#pagination"),
    gallery: document.querySelector('.gallery')
}

 const createCardElement = (iconName,data,container)=>{
     const element = document.createElement('P');
     element.className = 'stats-item';
            const innerElement = document.createElement('I');
            innerElement.textContent = iconName;
            innerElement.className = 'material-icons';
            element.innerHTML = data;
            element.appendChild(innerElement);
            container.appendChild(element);
        }


class GalleryApp {
    constructor() {
        this.pageNumber = 1;
        this.searchValue = '';
       
    }
  
    setSearchValue(val) {
        refs.gallery.innerHTML = '';
        this.searchValue = val;
        this.pageNumber = 1;
        if (val === '') {
            
            refs.loadMO.classList.add('hidden');
        }
        else {
            this.fetchItems();
            refs.loadMO.classList.remove('hidden');
        }
             
    }
    fetchItems() {
        fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.searchValue}&page=${this.pageNumber}&per_page=12&key=22553611-d17142b90db34a0c793ad1fbe`)
            .then(res => res.json())
            .then(data => {
                if (data.hits.length > 0)
                {
                    this.renderGallery(data.hits);
                }
                else {
                   

                    error({
                        text: 'no images found!'
                    });
                }

            })
            .catch(error => console.log(error));
        
    }
    increasePagenumber() {
        this.pageNumber++;
        this.fetchItems();
    }
    renderCard(itemdata) {
        const container = document.createElement('DIV');
       
        
        container.className = 'photo-card';
        const image = document.createElement('IMG');
        image.src = itemdata.webformatURL;
        container.appendChild(image);
        const innercontainer = document.createElement('DIV');
        innercontainer.className = 'stats';
        createCardElement('thumb_up',itemdata.likes,innercontainer);
        createCardElement('visibility',itemdata.views,innercontainer);
        createCardElement('comments',itemdata.comments,innercontainer);
        createCardElement('cloud_download', itemdata.downloads, innercontainer);
        console.log(container);
        container.appendChild(innercontainer);
        refs.gallery.appendChild(container);

        
            refs.loadMO.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
       
        
    }
    renderGallery(itemsarray) {
        itemsarray.map(item => this.renderCard(item));
       
        setTimeout(() => {  refs.loadMO.scrollIntoView({
          behavior: 'smooth',
            block: 'end',
        })
        },500)
    }

}

const myGallery = new GalleryApp();

refs.form.addEventListener('submit', (e) => {
    e.preventDefault();
    myGallery.setSearchValue(refs.input.value);
});

refs.loadMO.addEventListener('click', (e) => {
    e.preventDefault();
    myGallery.increasePagenumber();
});



