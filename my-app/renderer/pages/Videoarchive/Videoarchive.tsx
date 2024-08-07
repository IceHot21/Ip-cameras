import { FC } from "react"
import VStyles from "./Videoarchive.module.css"

const Videoarchive: FC = () => {

    const prevNavigation = () => {
        //логика для кнопки назад
    }

    const nextNavigation = () => {
        //логика для кнопки вперед
    }

    return (
        <div>
            <div className={VStyles.modal}>
                <div className={VStyles.header}>
                    <label>Имя Видео</label>
                    <i className="bi bi-x-lg"></i>
                </div>
                <div className={VStyles.videoContainer}></div>
                <div className={VStyles.navigButt}>
                    <div className={VStyles.prevButt} title="Назад">
                        <i className="{bi bi-caret-left-fill}" onClick={prevNavigation}></i>
                    </div>
                    <div className={VStyles.nextButt} title="Вперед">
                        <i className="{bi bi-caret-right-fill}" onClick={nextNavigation}></i>
                    </div>
                </div>
            </div>
            <div className={VStyles.Archive}>
                <label>Архив за 22.05.2023, 10:50:22 - 23.05.2023, 10:50:22</label>

                <div className={VStyles.iconSort}>
                    <i className="{bi bi-arrow-down-up}"></i>
                    <i className="{bi bi-grid-3x3-gap-fill}"></i>
                    <i className="{bi bi-funnel-fill}"></i>
                </div>

                <div className={VStyles.sortModal}>
                    <div className={VStyles.headerSort}>
                        <i className="{bi bi-x-lg}"></i>
                    </div>
                    <div className={VStyles.selectSort1}>
                        <select>
                            <option value="date">Дата и время</option>
                            <option value="name">Наименование</option>
                        </select>
                    </div>
                    <div className={VStyles.selectSort2}>
                        <select>
                            <option value="down">По убыванию</option>
                            <option value="up">По возрастанию</option>
                        </select>
                    </div>
                    <button>Ok</button>
                </div>

                <div className={VStyles.viewModal}>
                    <div className={VStyles.headerView}>
                        <i className="{bi bi-x-lg}"></i>
                    </div>
                    <div className={VStyles.viewButton}>
                        <button><i className="{bi bi-list-task}"></i><span>Список</span></button>
                        <button><i className="{bi bi-grid-3x3-gap-fill}"></i><span>Плитка</span></button>
                    </div>
                </div>

                <div className={VStyles.filtModal}>
                    <div className={VStyles.headerFilt}>
                        <i className="{bi bi-x-lg}"></i>
                    </div>
                    <div className={VStyles.filtContainer}>
                        <span>Выберите период:</span>
                        <div className={VStyles.data}>
                            <input type="datetime-local" className={VStyles.datatime}></input>
                            <input type="datetime-local" className={VStyles.datatime}></input>
                        </div>
                        <span>Выберите тип помещений:</span>
                        <div className={VStyles.placeTab}></div>
                        <div className={VStyles.filt}>
                            <button className="{btn btn-lg btn-success}">Применить</button>
                            <button className="{btn btn-lg btn-success}">Сброс фильтра</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Videoarchive