const imagePath = 'img/';
const imageCategories = {
    'small': '320w',
    'medium': '480w',
    'large': '800w',
    'default': 'large'
};

class ImageHelper {

    static fillImageElement(imageElement, restaurant) {

        let srcset = '';
        for (const [sizeCategory, filename] of Object.entries(restaurant.photographs)) {
            srcset = srcset.concat(`${imagePath}${filename} ${imageCategories[sizeCategory]},`);
        }
        imageElement.src = imagePath + restaurant.photographs[imageCategories.default];
        imageElement.srcset = srcset.substring(0, srcset.length - 1);
        imageElement.alt = restaurant.name;
    }
}