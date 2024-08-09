import { FC  } from "react"

const ModalPhoto:FC = () => {

    
  return (
    <div>
        {/* <motion.div
    className={PStyles.modal}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className={PStyles.header}>
      <label>Имя Фото</label>
      <BiX />
    </div>
    <div className={PStyles.photoContainer}></div>
    <div className={PStyles.navigButt}>
      <div className={PStyles.prevButt} title="Назад">
        <BiCaretLeft onClick={prevNavigation} />
      </div>
      <div className={PStyles.nextButt} title="Вперед">
        <BiCaretRight onClick={nextNavigation} />
      </div>
    </div>
    <div className={PStyles.zoomContainer}>
      <BiDownload onClick={savePhoto} />
      <BiZoomIn onClick={zoomIn} />
      <BiZoomOut onClick={zoomOut} />
      <BsAspectRatio onClick={beginPhoto} />
    </div>
  </motion.div> */}</div>
  )
}

export default ModalPhoto


