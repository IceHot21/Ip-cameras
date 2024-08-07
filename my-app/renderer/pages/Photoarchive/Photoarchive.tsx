import { FC } from "react"
import PStyles from "./Photoarchive.module.css"

//TODO: Нужны ли тут onCLick на все кнопки 

const Photoarchive: FC = () => {

    const prevNavigation = () => {
        //логика для кнопки назад
    }

    const nextNavigation = () => {
        //логика для кнопки вперед
    }

    const savePhoto = () => {
        //логика для кнопки сохранить фото
    }

    const zoomIn = () => {
        //логика для кнопки приближения
    }

    const zoomOut = () => {
        //логика для кнопки отдаления
    }

    const beginPhoto = () => {
        //логика для кнопки масштаба фото
    }


    return (
        <div>
            <div className={PStyles.modal}>
                <div className={PStyles.header}>
                    <label>Имя Фото</label>
                    <i className="bi bi-x-lg"></i>
                </div>
                <div className={PStyles.photoContainer}></div>
                <div className={PStyles.navigButt}>
                    <div className={PStyles.prevButt} title="Назад">
                        <i className="bi bi-caret-left-fill" onClick={prevNavigation}></i>
                    </div>
                    <div className={PStyles.nextButt} title="Вперед">
                        <i className="bi bi-caret-right-fill" onClick={nextNavigation}></i>
                    </div>
                </div>
                <div className={PStyles.zoomContainer}>
                    <i className="bi bi-download" onClick={savePhoto}></i>
                    <i className="bi bi-zoom-in" onClick={zoomIn}></i>
                    <i className="bi bi-zoom-out" onClick={zoomOut}></i>
                    <i className="bi bi-aspect-ratio" onClick={beginPhoto}></i>
                </div>
            </div>
            <div className={PStyles.Archive}>
                <label>Архив за 22.05.2023, 10:50:22 - 23.05.2023, 10:50:22</label>

                <div className={PStyles.iconSort}>
                    <i className="bi bi-arrow-down-up"></i>
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                    <i className="bi bi-funnel-fill"></i>
                </div>

                <div className={PStyles.sortModal}>
                    <div className={PStyles.headerSort}>
                        <i className="bi bi-x-lg"></i>
                    </div>
                    <div className={PStyles.selectSort1}>
                        <select>
                            <option value="date">Дата и время</option>
                            <option value="name">Наименование</option>
                        </select>
                    </div>
                    <div className={PStyles.selectSort2}>
                        <select>
                            <option value="down">По убыванию</option>
                            <option value="up">По возрастанию</option>
                        </select>
                    </div>
                    <button>Ok</button>
                </div>

                <div className={PStyles.viewModal}>
                    <div className={PStyles.headerView}>
                        <i className="bi bi-x-lg"></i>
                    </div>
                    <div className={PStyles.viewButton}>
                        <button><i className="bi bi-list-task"></i><span>Список</span></button>
                        <button><i className="bi bi-grid-3x3-gap-fill"></i><span>Плитка</span></button>
                    </div>
                </div>

                <div className={PStyles.filtModal}>
                    <div className={PStyles.headerFilt}>
                        <i className="bi bi-x-lg"></i>
                    </div>
                    <div className={PStyles.filtContainer}>
                        <span>Выберите период:</span>
                        <div className={PStyles.data}>
                            <input type="datetime-local" className={PStyles.datatime}></input>
                            <input type="datetime-local" className={PStyles.datatime}></input>
                        </div>
                        <span>Выберите тип помещений:</span>
                        <div className={PStyles.placeTab}></div>
                        <div className="'filt">
                            <button className="btn btn-lg btn-success">Применить</button>
                            <button className="btn btn-lg btn-success">Сброс фильтра</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Photoarchive