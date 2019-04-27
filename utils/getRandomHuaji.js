const huaji = {
    0: `${require('@/assets/images/huaji/0.jpg')}?width=250&height=250&huaji=true`,
    1: `${require('@/assets/images/huaji/1.gif')}?width=300&height=300&huaji=true`,
    2: `${require('@/assets/images/huaji/2.jpeg')}?width=245&height=206&huaji=true`,
    3: `${require('@/assets/images/huaji/3.jpg')}?width=225&height=225&huaji=true`,
    4: `${require('@/assets/images/huaji/4.jpeg')}?width=224&height=225&huaji=true`,
    5: `${require('@/assets/images/huaji/5.jpeg')}?width=200&height=200&huaji=true`,
    6: `${require('@/assets/images/huaji/6.jpeg')}?width=284&height=177&huaji=true7`,
    7: `${require('@/assets/images/huaji/7.gif')}?width=300&height=300&huaji=true`,
    8: `${require('@/assets/images/huaji/8.jpeg')}?width=225&height=225&huaji=true`,
    9: `${require('@/assets/images/huaji/9.jpeg')}?width=204&height=247&huaji=true`,
    10: `${require('@/assets/images/huaji/10.gif')}?width=223&height=226&huaji=true`,
    11: `${require('@/assets/images/huaji/11.gif')}?width=198&height=255&huaji=true`,
    12: `${require('@/assets/images/huaji/12.gif')}?width=212&height=237&huaji=true`,
};
const HuajiaCount = Object.keys(huaji).length;

export default function getRandomHuaji() {
    const number = Math.floor(Math.random() * HuajiaCount);
    return huaji[number];
}
