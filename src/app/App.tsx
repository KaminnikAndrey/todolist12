import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from '@mui/material/styles';
import React from "react";
import {Header} from "../common/components/Header/Header";
import {useAppSelector} from "../common/hooks/useAppSelector";
import {getTheme} from "../common/theme/theme";
import {selectThemeMode} from "./appSelectors";
import {Main} from "./Main";

export const App = () => {

	const themeMode = useAppSelector(selectThemeMode)

	return (
		<ThemeProvider theme={getTheme(themeMode)}>
			<CssBaseline/>
			<Header/>
			<Main/>
		</ThemeProvider>
	);
}


