<?php
/**
 * Klasa odpowiedzialna za minimalizacje kodu JS
 * 
 * @author: Patryk yarpo Jar yarpo.pl
 * @date: 15 04 2011
 * 
 * @uses JSmin http://www.crockford.com/javascript/jsmin.html
 * */
 
class JSCacher
{
	/**
	 * separator oddzielajacy kolejne nazwy plikow w przekazanym ciagu
	 * */
	private $sep = ',';

	/**
	 * rozszerzenie, jakie jest doklajane na koniec kazdej nazwy pliku
	 * */
	private $ext = '.js';

	/**
	 * sciezka do katalogu, w ktorym znajduja sie pliki JS [nieskompresowane]
	 * */
	private $path = './js/full/';

	/**
	 * sciezka gdzie maja byc zapisywane pliki skompresowane
	 * */
	private $minPath = './js/minjs/';

	/**
	 * sciezka do aktualnie przerabianego requesta
	 * */
	private $minFile;

	/**
	 * Zwraca ciag znakow bedacy zminimalizowanym kodem JS
	 * Jesli juz kiedys byl taki request - zwraca wartosc z cache'a
	 * w przeciwnym wypadku tworzy plik ze skompresowanym kodem, zapisuje
	 * go w cache'u i dopiero zwraca
	 * 
	 * @param $files string - ciag znakow nazwa_pliku{separator}nazwa_pliku
	 * @param $recache bool - flaga wymuszajaca ponowne skompresowanie requesta
	 * 
	 * @return string
	 * */
	public function minimize($files, $recache = false)
	{
		$this->minFile = $this->createFilePath(md5($files), $this->minPath);

		if (true === $recache || !file_exists($this->minFile))
		{
			return $this->readAndShrink($files);
		}
		else if (file_exists($this->minFile))
		{
			return file_get_contents($this->minFile);
		}
		return '/* error */';
	}

	private function readAndShrink($files)
	{
		$filesList = explode($this->sep, $files);
		$n = count($filesList);
		$code = '';

		for($i = 0; $i < $n; $i++)
		{
			$filePath = $this->createFilePath($filesList[$i], $this->path);
			if (file_exists($filePath))
			{
				$code .= JSMin::minify(file_get_contents($filePath));
			}
		}

		file_put_contents($this->minFile, $code);
		return $code;
	}

	private function createFilePath($file, $path)
	{
		return $path . trim($file) . $this->ext;
	}

	/** 
	 * getter / setter dla rozszerzenia plikow js
	 * */
	public function extension($v = false)
	{
		if (false !== $v)
		{
			$this->ext = $v;
		}
		return $this->ext;
	}

	public function path($v = false)
	{
		if (false !== $v)
		{
			$this->path = $v;
		}
		return $this->path;
	}

	public function minPath($v = false)
	{
		if (false !== $v)
		{
			$this->minPath = $v;
		}
		return $this->minPath;
	}

	public function separator($v = false)
	{
		if (false !== $v)
		{
			$this->sep = $v;
		}
		return $this->sep;
	}
}
