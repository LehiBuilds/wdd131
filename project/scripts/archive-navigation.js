export function initializeArchiveNavigation(episodes) {

    const backButton =
        document.getElementById("back-top-btn");


    const jumpButton =
        document.getElementById("jump-episode-btn");


    const menu =
        document.getElementById("episode-jump-menu");


    const list =
        document.getElementById("episode-jump-list");


    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 500) {

                backButton.style.display =
                    "flex";

            } else {

                backButton.style.display =
                    "none";

            }

        }
    );


    backButton.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    jumpButton.addEventListener(
        "click",
        () => {

            menu.hidden =
                !menu.hidden;

        }
    );


    episodes
        .filter(
            (_, index) =>
                index % 10 === 0
        )
        .forEach(
            episode => {

                const button =
                    document.createElement("button");

                button.className =
                    "jump-item";

                button.textContent =
                    `Episode ${episode.id}`;


                button.onclick =
                    () => {

                        document
                            .querySelector(
                                `[data-episode-id="${episode.id}"]`
                            )
                            ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                    };


                list.appendChild(button);

            }
        );

}