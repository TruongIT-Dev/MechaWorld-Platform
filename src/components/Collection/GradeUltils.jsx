// Import Grade images
import EG_Pic from '../../assets/image/category/eg-gundam.png';
import HG_Pic from '../../assets/image/category/hg-gundam.png';
import MG_Pic from '../../assets/image/category/mg-gundam.png';
import PG_Pic from '../../assets/image/category/pg-gundam.png';
import RG_Pic from '../../assets/image/category/rg-gundam.png';
import SD_Pic from '../../assets/image/category/sd-gundam.png';

// Utility function to get the color for grade tag
export const getGradeColor = (grade) => {
    switch (grade) {
        case 'Entry Grade': return 'cyan';
        case 'High Grade': return 'green';
        case 'Real Grade': return 'purple';
        case 'Master Grade': return 'blue';
        case 'Perfect Grade': return 'gold';
        case 'Super Deformed': return 'magenta';
        default: return 'default';
    }
};

// Utility function to get the image for grade
export const getGradeImage = (grade) => {
    switch (grade) {
        case 'Entry Grade': return EG_Pic;
        case 'High Grade': return HG_Pic;
        case 'Master Grade': return MG_Pic;
        case 'Real Grade': return RG_Pic;
        case 'Perfect Grade': return PG_Pic;
        case 'Super Deformed': return SD_Pic;
        default: return HG_Pic;
    }
};