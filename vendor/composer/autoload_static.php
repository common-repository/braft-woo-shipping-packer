<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit82d306252247dc0da1dc24eb3ea7841a
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'Psr\\Log\\' => 8,
        ),
        'D' => 
        array (
            'DVDoug\\BoxPacker\\Test\\' => 22,
            'DVDoug\\BoxPacker\\' => 17,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Psr\\Log\\' => 
        array (
            0 => __DIR__ . '/..' . '/psr/log/Psr/Log',
        ),
        'DVDoug\\BoxPacker\\Test\\' => 
        array (
            0 => __DIR__ . '/..' . '/dvdoug/boxpacker/tests/Test',
        ),
        'DVDoug\\BoxPacker\\' => 
        array (
            0 => __DIR__ . '/..' . '/dvdoug/boxpacker/src',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit82d306252247dc0da1dc24eb3ea7841a::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit82d306252247dc0da1dc24eb3ea7841a::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}
