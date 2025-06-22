import { useContext, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { AppContext } from "../contexts/AppContext";
import { RESTQuery } from "../helper/restQuery";

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMyThemes = async () => {
    if (!user) return [];

    try {
      setLoading(true);
      const themes = await RESTQuery.ThemeAPI.getMyThemes(user.accessToken);
      return themes || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const publishTheme = async (themeId) => {
    if (!user) return false;

    try {
      setLoading(true);
      const response = await RESTQuery.ThemeAPI.publishTheme(
        user.accessToken,
        themeId
      );
      return response.ok;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unpublishTheme = async (themeId) => {
    if (!user) return false;

    try {
      setLoading(true);
      const response = await RESTQuery.ThemeAPI.unpublishTheme(
        user.accessToken,
        themeId
      );
      return response.ok;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    theme,
    setTheme,
    getMyThemes,
    publishTheme,
    unpublishTheme,
    loading,
    error,
  };
};
